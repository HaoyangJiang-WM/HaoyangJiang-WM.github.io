# Neural equations: selected sensor-response studies

## Source and scope
This online edition is based on `NIE_MultiCase_Screen_Complete.zip`, study date 2026-09-23. It publishes previously saved results, not a new training run. These are self-implemented numerical prototypes, not measured data, official ANIE or Spectral NIE reproductions, or a state-of-the-art claim.

## Exploration and independent confirmation
Six reference systems were explored with four NIE variants, history NODE-8/32, and Neural DDE. The full screen includes the unfavorable results: Mackey–Glass favors Neural DDE, and complete-state Duffing favors current-state NODE. There were 98 new training configurations, including 12 third-seed runs after three candidates were locked.

Selected pairs: diffusion2d / nie_mlp; relaxation / nie_exp; wave1d / nie_mlp. Confirmation B uses seeds 5301, 5302 and 5303; each case has 64 new same-family inputs and 64 doubled-frequency inputs. Candidates were not changed using B. This is independent-input confirmation following exploratory selection, not a wholly preregistered project or an equal model-search-budget contest.

## Shared information and training
Each case uses 128 training histories and 32 validation histories. All methods receive the same 33 sensor-history samples, exact current state, and known causal control. Response/history noise is 0.5% of the training scale. Hidden reference fields and physical coefficients are not given to the learner. All weights, kernel coefficients and DDE delays are jointly learned with Adam/L-BFGS; no conditional readout or variable projection is used.

History and training horizon are H=T=3.2 for featured tasks. Long evaluation uses T/2T/4T/8T, up to 25.6. All prefixes of one input are correlated. Time-continuous controls are the supplied discrete samples' piecewise-linear interpolation. Reference hidden states start at zero at -3.2.

The per-configuration threshold is 45 single-thread process-CPU seconds, including optimization, validation and rollback, excluding initial JIT compilation. Actual durations across all runs were 32.702–48.898 seconds. Larger NODEs have more parameters but can complete fewer updates. This is not an exhaustive hyperparameter search.

## What each curve and number means
The online viewer shows fixed confirmation case 0, chosen by index rather than error, with all three seeds and both input families. It uses every second stored time point (129 display samples), six-decimal input rounding, then per-curve 16-bit quantization. This compact representation is for visualization only. Maximum encoding error is recorded in release.json. Lines between samples are visual interpolation, not new solver output. No network is trained in the browser.

Tables use complete archived evaluations: for each input, RMSE across future time and observed channels after dividing by per-channel training standard deviation, times 100. Average 64 inputs within each seed, then report mean and sample SD across the three seeds. This is not raw relative L2 or a confidence interval across different physical systems. The raw relative-L2 column remains in downloadable results. Public CSV summaries round floating values to four decimal places; the original archive retains full precision. Failed or infinite results are not omitted.

## Interpretation and limitations
Diffusion: NIE beats the tested history NODEs at long horizons; DDE is more accurate on same-family inputs. Frequency-shift NIE/DDE scores are close and their ordering changes under refinement.

Relaxation: NIE's constant-plus-positive-decay kernel is an explicit family prior; rates and mixtures are learned. DDE is better on same-family forcing. NIE has lower aggregate error when forcing frequency doubles, but not on every input.

Wave: retain only same-family long-horizon prediction. Doubled-frequency forcing produces very high errors and NIE is worse than NODE-8 and DDE. The tiny same-family NIE/DDE gap is not robust to quadrature refinement.

All 36 confirmation models were re-evaluated at half future time step; wave NIE and DDE also at quarter step. The large gaps vs history NODEs remained. No strict continuum or spatial convergence guarantee follows. Confirmation had no failed solves; all exploratory failures remain in the full screening results.

## Reproduction
The complete experiment archive was delivered alongside this portfolio in the research conversation. The online repository contains the visual-replay exports, all screening/confirmation/refinement summary CSVs and their hashes. It does not contain all 98 model checkpoints. Use the archive for retraining or high-precision replay, not the quantized website curves.

Background: Neural ODEs (arXiv:1806.07366); Neural Integral Equations (arXiv:2209.15190); Spectral Methods for Neural Integral Equations (arXiv:2312.05654); Time and State Dependent Neural Delay Differential Equations (PMLR 255, mons​el24a).
