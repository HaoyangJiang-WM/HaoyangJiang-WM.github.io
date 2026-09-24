# Neural Equation Demos

Interactive scientific machine learning portfolio by **Haoyang Jiang**, Ph.D. researcher in Data Science at William & Mary.

[Live site](https://haoyangjiang-wm.github.io/neural-equation-demos/) · [Professional CV](https://raw.githubusercontent.com/HaoyangJiang-WM/CV/main/Haoyang_Jiang_CV.pdf)

The site compares neural integral models, history-encoded Neural ODEs, and learned-delay Neural DDEs on diffusion sensing, multirate relaxation, and damped-wave sensing.

- All reference and model curves are visible by default; each can be toggled individually.
- Switch input family, seed, sensor, and prediction horizon from T through 8T.
- Replay curves show fixed test case 0. Tables summarize all 64 test inputs and three seeds per configuration.
- Reference-system equations are separate from learned-model equations. Hidden reference fields are not supplied as predictor inputs.

The browser uses archived predictions, not live model training. The numerical data, failure records, and benchmark coverage are preserved in `evidence/`. Full methodology and scope are in [the protocol](evidence/protocol.md).

## Maintenance

`index.html`: page content. `assets/memory.js`: replay and controls. `assets/site.css` and `assets/compact.css`: layout. `release.json`: publication hashes. Scripts under `tools/` verify the deployed assets and the professional CV link.
