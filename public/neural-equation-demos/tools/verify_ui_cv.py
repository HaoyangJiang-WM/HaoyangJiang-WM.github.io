"""Read-only HTTP checks for the compact demo interface and professional CV."""
import json
from pathlib import Path
import time
import urllib.request

BASE = 'https://haoyangjiang-wm.github.io/neural-equation-demos/'
CV = 'https://haoyangjiang-wm.github.io/cv/'

def get(url):
    for attempt in range(8):
        try:
            req = urllib.request.Request(url + '?check=html-cv-20261113', headers={'Cache-Control':'no-cache','User-Agent':'Portfolio-Publication-Check'})
            with urllib.request.urlopen(req, timeout=25) as response:
                assert response.status == 200
                return response.read()
        except Exception:
            if attempt == 7:
                raise
            time.sleep(5)

html = get(BASE).decode('utf-8')
js = get(BASE + 'assets/memory.js').decode('utf-8')
assert html.count('href="/cv/"') == 3
assert 'SELECTED &amp; INDEPENDENTLY CONFIRMED' not in html
assert 'These are selected case studies' not in html
assert "['truth',...data[task].kinds]" in js
assert 'input.checked=true' in js
assert 'if(k!==\'node32\')' not in js
assert 'id="show-all"' in html
cv = get(CV).decode('utf-8')
assert '<h1>Curriculum Vitae</h1>' in cv
assert '<h2 id="education">Education</h2>' in cv
report = {'result':'PASS','cv_url':CV,'cv_links':3,'default_curve_configuration':'reference + all four models','check_scope':'public HTTP and static configuration; browser interaction tested separately'}
Path('interface-cv-verification.json').write_text(json.dumps(report, indent=2))
print('PASS: compact interface, default-curve configuration, and HTML CV.')
