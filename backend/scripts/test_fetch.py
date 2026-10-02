import requests

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

def test_url(url):
    try:
        r = requests.get(url, headers=headers, timeout=10)
        print(f"[{r.status_code}] len={len(r.content)} url={url}")
        return r.status_code == 200
    except Exception as e:
        print(f"[ERR] {url}: {e}")
        return False

print("--- Testing AMFI ---")
test_url("https://www.amfiindia.com/")
test_url("https://www.amfiindia.com/investor-corner/knowledge-center/faqs.html")
test_url("https://www.amfiindia.com/investor-corner/knowledge-center/what-are-mutual-funds.html")

print("--- Testing HDFC ---")
test_url("https://www.hdfcfund.com")
test_url("https://www.hdfcfund.com/our-products/equity")
test_url("https://files.hdfcfund.com")

print("--- Testing SEBI ---")
test_url("https://investor.sebi.gov.in/faqs.html")
test_url("https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doFaq=yes")
