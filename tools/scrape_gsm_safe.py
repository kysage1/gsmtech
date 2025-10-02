#!/usr/bin/env python3
"""
Safe GSMServer scraper (full site).

Features:
- Respects robots.txt
- Requests with a modern User-Agent
- Rate limiting and exponential backoff retries
- Parallel worker pool for URL fetching with polite delay
- Saves raw scraped product JSON to ../data/scraped_products.json
- Merges deduplicated products into ../products.json

Run from repository root with the project's python environment active.
"""
import time
import json
import re
import os
import sys
from urllib.parse import urljoin, urlparse
import queue
import threading

import requests
from bs4 import BeautifulSoup

ROOT = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(ROOT, 'data')
os.makedirs(DATA_DIR, exist_ok=True)

BASE = 'https://gsmserver.com/en/'
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
}

def allowed_by_robots(session, base_url):
    try:
        rp_url = urljoin(base_url, '/robots.txt')
        r = session.get(rp_url, timeout=10, headers=HEADERS)
        if r.status_code != 200:
            return True
        txt = r.text
        # Simple check: disallow lines for User-agent: * /en/
        # We take a conservative approach: if /en/ is disallowed, abort.
        for line in txt.splitlines():
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if line.lower().startswith('disallow:'):
                path = line.split(':',1)[1].strip()
                if path and path.startswith('/en'):
                    print('robots.txt disallows /en/ - aborting to be polite')
                    return False
        return True
    except Exception as e:
        print('robots.txt check failed, proceeding cautiously:', e)
        return True


def fetch(url, session, retries=3):
    backoff = 1.0
    for attempt in range(retries):
        try:
            r = session.get(url, timeout=15, headers=HEADERS)
            if r.status_code == 200:
                return r.text
            elif r.status_code in (403, 429):
                print(f'Blocked or rate limited ({r.status_code}) for {url} (attempt {attempt+1})')
            else:
                print(f'Non-200 ({r.status_code}) for {url}')
        except Exception as e:
            print('fetch error', e)
        time.sleep(backoff)
        backoff *= 2
    return None


def discover_product_links(html, base=BASE):
    soup = BeautifulSoup(html, 'html.parser')
    links = set()
    # product links often contain '/p/' or '/product/' in path
    for a in soup.find_all('a', href=True):
        href = a['href']
        full = urljoin(base, href)
        p = urlparse(full)
        if '/p/' in p.path or '/product/' in p.path or re.search(r'/\d{3,}', p.path):
            links.add(full.split('?')[0])
    return links


def parse_product_page(html, url):
    soup = BeautifulSoup(html, 'html.parser')
    title = soup.select_one('h1')
    name = title.get_text(strip=True) if title else None
    price = None
    # heuristic: price in element with class 'price' or inside strong
    price_el = soup.select_one('.price') or soup.find('strong')
    if price_el:
        txt = price_el.get_text(' ', strip=True)
        m = re.search(r'\d+[.,]?\d*', txt)
        if m:
            price = float(m.group(0).replace(',', '.'))
    imgs = []
    for img in soup.find_all('img'):
        src = img.get('src') or img.get('data-src')
        if not src:
            continue
        src = urljoin(url, src)
        if src.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            imgs.append(src)
    desc = ''
    d = soup.select_one('.description') or soup.select_one('#description')
    if d:
        desc = d.get_text(' ', strip=True)
    # try to extract product id from URL
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


def worker(q, session, out, lock, seen_urls, delay):
    while True:
        try:
            url = q.get_nowait()
        except queue.Empty:
            return
        if url in seen_urls:
            q.task_done()
            continue
        seen_urls.add(url)
        html = fetch(url, session)
        if not html:
            q.task_done()
            continue
        if '/p/' in url or re.search(r'/\d{5,}', url):
            data = parse_product_page(html, url)
            with lock:
                out.append(data)
        # discover more links
        links = discover_product_links(html, base=url)
        for l in links:
            if l not in seen_urls:
                q.put(l)
        time.sleep(delay)
        q.task_done()


def merge_into_products(new_items, products_path):
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
            for k in ('images','price','description','url','name'):
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
    session = requests.Session()
    if not allowed_by_robots(session, BASE):
        print('Aborting due to robots.txt')
        return
    q = queue.Queue()
    q.put(BASE)
    lock = threading.Lock()
    seen_urls = set()
    out = []
    workers = []
    concurrency = 6
    delay = 0.6  # polite delay between requests per worker
    for _ in range(concurrency):
        t = threading.Thread(target=worker, args=(q, session, out, lock, seen_urls, delay), daemon=True)
        t.start()
        workers.append(t)
    # wait for queue to drain
    try:
        while any(t.is_alive() for t in workers):
            time.sleep(1)
            if q.empty():
                break
        q.join()
    except KeyboardInterrupt:
        print('Interrupted')

    # save raw scraped
    scraped_path = os.path.join(DATA_DIR, 'scraped_products.json')
    with open(scraped_path, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f'Scraped {len(out)} product pages (raw). Saved to {scraped_path}')

    # merge
    products_path = os.path.join(ROOT, 'products.json')
    added = merge_into_products(out, products_path)
    print(f'Merged into {products_path} - added {added} new products')


if __name__ == '__main__':
    main()
