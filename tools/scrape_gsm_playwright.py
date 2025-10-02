#!/usr/bin/env python3
"""
Playwright-based GSMServer scraper.

Usage:
  Activate the project's venv and run:
    python tools/scrape_gsm_playwright.py

This script:
- Checks robots.txt
- Launches a Chromium browser via Playwright
- Crawls the /en/ site, collects product links and metadata
- Saves raw results to data/scraped_products.json
- Merges deduplicated products into products.json

Be courteous: this script uses polite delays and a single browser instance.
"""
import os
import re
import json
import time
from urllib.parse import urljoin, urlparse

import requests
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(ROOT, 'data')
os.makedirs(DATA_DIR, exist_ok=True)

BASE = 'https://gsmserver.com/en/'
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
}


def allowed_by_robots():
    try:
        r = requests.get(urljoin(BASE, 'robots.txt'), timeout=10, headers=HEADERS)
        if r.status_code != 200:
            return True
        for line in r.text.splitlines():
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if line.lower().startswith('disallow:'):
                path = line.split(':', 1)[1].strip()
                if path and path.startswith('/en'):
                    print('robots.txt disallows /en/ — aborting to respect robots')
                    return False
        return True
    except Exception as e:
        print('robots.txt check failed, proceeding cautiously:', e)
        return True


def extract_product_from_page(page, url):
    # page is a Playwright Page after navigation
    title = page.query_selector('h1')
    name = title.inner_text().strip() if title else None
    price = None
    # heuristics
    price_el = page.query_selector('.price') or page.query_selector('strong')
    if price_el:
        txt = price_el.inner_text().strip()
        m = re.search(r"\d+[.,]?\d*", txt)
        if m:
            try:
                price = float(m.group(0).replace(',', '.'))
            except Exception:
                price = None
    imgs = []
    for img in page.query_selector_all('img'):
        try:
            src = img.get_attribute('src') or img.get_attribute('data-src')
            if not src:
                continue
            src = urljoin(url, src)
            if src.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                imgs.append(src)
        except Exception:
            continue
    desc = ''
    d = page.query_selector('.description') or page.query_selector('#description')
    if d:
        desc = d.inner_text().strip()
    pid = None
    m = re.search(r'/p/(\d+)', url)
    if not m:
        m = re.search(r'(\d{5,})', url)
    if m:
        pid = int(m.group(1))
    return {
        'id': pid or None,
        'url': url,
        'name': name,
        'price': price,
        'images': imgs,
        'description': desc,
    }


def crawl_all():
    if not allowed_by_robots():
        return []

    scraped = []

    with sync_playwright() as p:
        # try headless first, fall back to headful with stealth tweaks if blocked
        try_headful = False
        try:
            browser = p.chromium.launch(headless=True)
        except Exception:
            browser = p.chromium.launch(headless=False)
            try_headful = True

        context = browser.new_context(user_agent=HEADERS['User-Agent'], locale='en-US', viewport={'width':1366,'height':768})
        # basic stealth: hide webdriver flag
        context.add_init_script("() => { Object.defineProperty(navigator, 'webdriver', {get: () => undefined}); }")
        # more headers
        context.set_extra_http_headers({'accept-language': 'en-US,en;q=0.9'})
        page = context.new_page()
        print('Loading base page... (headful fallback=' + str(try_headful) + ')')
        # robust navigation: retry once with a longer timeout if networkidle times out
        try:
            page.goto(BASE, wait_until='networkidle', timeout=60000)
        except Exception as e:
            print('Base page navigation timed out or failed:', e)
            try:
                page.goto(BASE, wait_until='load', timeout=90000)
            except Exception as e2:
                print('Fallback navigation failed:', e2)
                print('Proceeding with whatever links we can discover (may be none)')
                # continue; links set may be empty
        time.sleep(1)
        # collect product links from homepage
        anchors = page.query_selector_all('a')
        links = set()
        for a in anchors:
            try:
                href = a.get_attribute('href')
                if not href:
                    continue
                full = urljoin(BASE, href)
                purl = urlparse(full)
                if '/p/' in purl.path or '/product/' in purl.path or re.search(r'/\d{5,}', purl.path):
                    links.add(full.split('?')[0])
            except Exception:
                continue

        print(f'Found {len(links)} initial product links; now crawling categories and product pages...')

        # crawl category pages linked from nav to expand link set
        nav_anchors = page.query_selector_all('nav a')
        category_links = set()
        for a in nav_anchors:
            href = a.get_attribute('href') if a else None
            if not href:
                continue
            full = urljoin(BASE, href)
            category_links.add(full.split('?')[0])

        # Follow pagination inside categories (deep crawl)
        for cat in category_links:
            try:
                next_page = cat
                while next_page:
                    try:
                        page.goto(next_page, wait_until='networkidle', timeout=60000)
                    except Exception:
                        # try a more relaxed load wait; if still failing, skip this page
                        try:
                            page.goto(next_page, wait_until='load', timeout=90000)
                        except Exception as e:
                            print('Failed to load category page', next_page, e)
                            break
                    time.sleep(0.8)
                    for a in page.query_selector_all('a'):
                        href = a.get_attribute('href')
                        if not href:
                            continue
                        full = urljoin(next_page, href)
                        purl = urlparse(full)
                        if '/p/' in purl.path or re.search(r'/\d{5,}', purl.path):
                            links.add(full.split('?')[0])

                    # try to find a pagination next link
                    next_el = page.query_selector('a.next, a[rel="next"], .pagination a.next')
                    if next_el:
                        np_href = next_el.get_attribute('href')
                        if np_href:
                            next_page = urljoin(next_page, np_href)
                            # avoid loops
                            if next_page in category_links:
                                break
                            category_links.add(next_page)
                            continue
                    break
            except Exception:
                continue

        print(f'Total discovered product links: {len(links)}')

        # iterate product links one by one
        for i, l in enumerate(sorted(links)):
            try:
                print(f'[{i+1}/{len(links)}] Visiting {l}')
                try:
                    page.goto(l, wait_until='networkidle', timeout=60000)
                except Exception:
                    try:
                        page.goto(l, wait_until='load', timeout=90000)
                    except Exception as e:
                        print('Failed to load product page', l, e)
                        continue
                time.sleep(0.8)
                data = extract_product_from_page(page, l)
                scraped.append(data)
            except Exception as e:
                print('Failed to fetch', l, e)
                continue

        browser.close()

    return scraped


def merge_into_products(new_items):
    products_path = os.path.join(ROOT, 'products.json')
    try:
        with open(products_path, 'r', encoding='utf-8') as f:
            existing = json.load(f)
    except Exception:
        existing = []
    by_id = {int(p['id']): p for p in existing if p.get('id')}
    added = 0
    for it in new_items:
        if not it.get('id'):
            continue
        pid = int(it['id'])
        if pid in by_id:
            # update missing fields
            for k in ('images', 'price', 'description', 'url', 'name'):
                if it.get(k) and not by_id[pid].get(k):
                    by_id[pid][k] = it[k]
        else:
            by_id[pid] = it
            added += 1
    merged = list(by_id.values())
    with open(products_path, 'w', encoding='utf-8') as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)
    return added


def main():
    print('Starting Playwright scraper...')
    items = crawl_all()
    scraped_path = os.path.join(DATA_DIR, 'scraped_products.json')
    with open(scraped_path, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    print(f'Saved {len(items)} scraped items to {scraped_path}')
    added = merge_into_products(items)
    print(f'Added {added} new products into products.json')


if __name__ == '__main__':
    main()
