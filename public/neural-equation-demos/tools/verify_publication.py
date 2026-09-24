"""Read-only validation of the published portfolio and its replay data."""
import base64
import csv
import hashlib
import io
import json
import math
import os
from pathlib import Path
import struct
import sys
import time
import urllib.request
import zlib

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://haoyangjiang-wm.github.io/neural-equation-demos/'
LOCAL = '--local' in sys.argv
checked = []

def get(relative):
    path = Path(relative)
    if path.is_absolute() or '..' in path.parts:
        raise ValueError('Unsafe asset path')
    expected = (ROOT / relative).read_bytes()
    if LOCAL:
        content = expected
    else:
        last = None
        for attempt in range(8):
            try:
                url = BASE + relative + '?revision=' + os.environ.get('GITHUB_SHA', 'confirmation-b')
                request = urllib.request.Request(url, headers={
                    'User-Agent': 'Neural-Demos-Publication-Check',
                    'Cache-Control': 'no-cache'})
                with urllib.request.urlopen(request, timeout=20) as response:
                    if response.status != 200:
                        raise RuntimeError('HTTP ' + str(response.status))
                    content = response.read()
                if content != expected:
                    raise RuntimeError('Published bytes differ: ' + relative)
                break
            except Exception as exc:
                last = exc
                time.sleep(5)
        else:
            raise RuntimeError(str(last))
    digest = hashlib.sha256(content).hexdigest()
    checked.append({'path': relative, 'sha256': digest,
                    'status': 'local' if LOCAL else 200})
    return content

release = json.loads(get('release.json'))
contents = {}
for path, sha in release['assets'].items():
    contents[path] = get(path)
    assert hashlib.sha256(contents[path]).hexdigest() == sha, path
rows = list(csv.DictReader(io.StringIO(contents['evidence/confirmation-summary.csv'].decode())))
assert len(rows) == 96
summary = {(r['task'], r['kind'], r['family'], int(r['multiple'])): r for r in rows}
assert len(summary) == 96
assert set(release['tasks']) == {'diffusion2d', 'relaxation', 'wave1d'}
assert release['seeds'] == [5301, 5302, 5303]
curves = 0
for name, meta in release['tasks'].items():
    joined = b''.join(contents[path] for path in meta['parts'])
    assert hashlib.sha256(joined).hexdigest() == meta['sha256'], name
    data = json.loads(joined)
    assert data['task'] == name and data['seeds'] == release['seeds']
    assert len(data['kinds']) == 4
    assert set(data['families']) == {'new', 'shift'}
    for family, values in data['families'].items():
        assert values['count'] == 129 and values['end'] == 25.6
        assert len(values['control']) == 129
        raw = zlib.decompress(base64.b64decode(values['q'], validate=True))
        assert len(raw) == 13 * 129 * 2 * 2
        offset = 0
        for series in range(13):
            accum = [0, 0]
            for i in range(129):
                for channel in range(2):
                    delta, = struct.unpack_from('<H', raw, offset)
                    offset += 2
                    accum[channel] = (accum[channel] + delta) % 65536
                    value = values['lo'][series][channel] + accum[channel] * values['step'][series][channel]
                    assert math.isfinite(value)
            curves += 1
        for kind in data['kinds']:
            for index, horizon in enumerate([1, 2, 4, 8]):
                mean, sd, failures = values['summary'][kind][index]
                row = summary[name, kind, family, horizon]
                assert abs(mean - float(row['mean_percent'])) <= 0.000051
                assert abs(sd - float(row['sd_percent'])) <= 0.000051
                assert failures == int(row['failures'])
screen = list(csv.DictReader(io.StringIO(contents['evidence/screen-summary.csv'].decode())))
assert len(screen) == 344
assert sum(int(r['failures']) for r in screen) == 20
refined = list(csv.DictReader(io.StringIO(contents['evidence/refinement-summary.csv'].decode())))
assert len(refined) == 112
report = {'result': 'PASS', 'mode': 'local' if LOCAL else 'public-http',
          'url': BASE, 'edition': release['edition'], 'files': checked,
          'tasks': list(release['tasks']), 'decoded_series': curves,
          'confirmation_rows': len(rows), 'screen_rows': len(screen),
          'refinement_rows': len(refined)}
Path('publication-verification.json').write_text(json.dumps(report, indent=2))
print('PASS:', len(checked), 'files checked;', curves, 'replay series decoded;',
      len(rows), 'confirmation rows matched; screening failures preserved.')
print('MODE:', report['mode'])
print('SITE:', BASE)
