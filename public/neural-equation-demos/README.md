# Neural Equations for Systems with Memory

Research portfolio by Haoyang Jiang, William & Mary.

Live site: https://haoyangjiang-wm.github.io/neural-equation-demos/

This edition features three selected, independently confirmed numerical studies: two-dimensional diffusion sensing, multirate nonlinear relaxation, and damped wave sensing. Each includes its reference equation, the learned model description, an interactive frozen-prediction replay, and complete summary comparisons with history Neural ODEs and learned-delay Neural DDEs.

The replay uses unselected confirmation case 0, all three seeds, two sensor channels, same-family and doubled-frequency inputs, and horizons T through 8T. Display samples are compressed for delivery; summary metrics use the full stored evaluations. See evidence/protocol.md and release.json for provenance and limitations.

These are research prototypes, not official ANIE/Spectral NIE reproductions, physical measurements, or a universal superiority claim. Different featured tasks use different selected NIE kernels. Unfavorable cases and stronger DDE results remain in the evidence.

This directory contains the lightweight online exports, not all 98 training checkpoints. The complete experimental archive is NIE_MultiCase_Screen_Complete.zip supplied with the original study.

Validate local exports:

```sh
python3 tools/verify_publication.py --local
```

Validate published files against this checkout:

```sh
python3 tools/verify_publication.py
```

The existing repository Pages build copies this public directory without modifying the personal homepage.
