"""Simple helper to fetch a product page and extract main image URLs.
Usage: python tools\scrape_gsm.py https://gsmserver.com/en/octoplus-full-1-year-digital-license/
"""
import sys
import requests
from bs4 import BeautifulSoup


def extract_images(url):
    r = requests.get(url, headers={"User-Agent":"Mozilla/5.0"})
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    images = []
    # common product img selectors
    for sel in ['.product-media img', '.product-img img', '.main-image img', 'img']:
        for img in soup.select(sel):
            src = img.get('src') or img.get('data-src')
            if src and 'gsm.com' in src:
                images.append(src)
    # unique set
    return list(dict.fromkeys(images))

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python tools\\scrape_gsm.py <product-url>')
        sys.exit(1)
    url = sys.argv[1]
    imgs = extract_images(url)
    if not imgs:
        print('No images found')
    else:
        for i in imgs:
            print(i)
