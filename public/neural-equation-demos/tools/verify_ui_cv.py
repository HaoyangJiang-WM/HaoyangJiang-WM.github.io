"""Read-only HTTP checks for the compact demo interface and professional CV."""
import hashlib
import json
from pathlib import Path
import time
import urllib.request

BASE = 'https://haoyangjiang-wm.github.io/neural-equation-demos/'
CV = 'https://raw.githubusercontent.com/HaoyangJiang-WM/CV/main/'

def get(url):
    for attempt in range(8):
        try:
            req = urllib.request.Request(url + '?check=professional-20260924', headers={'Cache-Control':'no-cache','User-Agent':'Portfolio-Publication-Check'})
            with urllib.request.urlopen(req, timeout=25) as response:
                assert response.status == 200
                return response.read()
        except Exception:
            if attempt == 7:
                raise
            time.sleep(5)

html = get(BASE).decode('utf-8')
js = get(BASE + 'assets/memory.js').decode('utf-8')
assert html.count('CV/main/Haoyang_Jiang_CV.pdf') == 3
assert 'SELECTED &amp; INDEPENDENTLY CONFIRMED' not in html
assert 'These are selected case studies' not in html
assert "['truth',...data[task].kinds]" in js
assert 'input.checked=true' in js
assert 'if(k!==\'node32\')' not in js
assert 'id="show-all"' in html
cv = get(CV + 'Haoyang_Jiang_CV.pdf')
legacy = get(CV + 'Haoyang_Jiang_Resume.pdf')
assert cv.startswith(b'%PDF-') and len(cv) > 30000
assert cv == legacy
report = {'result':'PASS','cv_bytes':len(cv),'cv_sha256':hashlib.sha256(cv).hexdigest(),'legacy_pdf_matches':True,'cv_links':3,'default_curve_configuration':'reference + all four models','check_scope':'public HTTP and static configuration; browser interaction tested separately'}
Path('interface-cv-verification.json').write_text(json.dumps(report, indent=2))
print('PASS: compact interface and default-curve configuration; professional CV HTTP 200;', len(cv), 'bytes; legacy PDF matches.')
print('CV SHA256:', report['cv_sha256'])
