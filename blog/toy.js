const forcing = document.querySelector("#forcing");
const gauge = document.querySelector("#gauge");
const output = document.querySelector("#forcing-value");
const readout = document.querySelector("#readout");
const canvas = document.querySelector("#trajectories");
const ctx = canvas.getContext("2d");
const steps = 8;

function trajectory(boundary, selectedGauge) {
  let state = [0, 0, 0];
  const values = [0];
  for (let step = 0; step < steps; step++) {
    const upstream = [boundary, ...state];
    state = state.map((value, index) => (value + upstream[index]) / 2);
    values.push(state[selectedGauge]);
  }
  return values;
}

function draw() {
  const highInput = Number(forcing.value);
  const selectedGauge = Number(gauge.value);
  const high = trajectory(highInput, selectedGauge);
  const low = trajectory(0, selectedGauge);
  const mean = high.map((value, index) => (value + low[index]) / 2);
  const lowReading = low[steps].toFixed(3);
  const highReading = high[steps].toFixed(3);
  output.value = highInput.toFixed(1);
  readout.textContent = `At step ${steps}, gauge ${selectedGauge + 1} reads ${lowReading} with zero input and ${highReading} with high input (gap ${(high[steps] - low[steps]).toFixed(3)}).`;
  if (highInput > 0) readout.textContent += ` The readings first differ at step ${selectedGauge + 1}.`;
  else readout.textContent += " The readings coincide at every step.";
  canvas.setAttribute("aria-label", `Gauge ${selectedGauge + 1} signal by forecast step. ${readout.textContent}`);
  if (!ctx) return;

  const { width, height } = canvas.getBoundingClientRect();
  if (!width || !height) return;
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  ctx.scale(scale, scale);
  const left = 43;
  const right = width - 14;
  const top = 29;
  const bottom = height - 42;
  const x = (step) => left + (right - left) * step / steps;
  const y = (value) => bottom - (bottom - top) * value / 2;

  ctx.font = '12px "Source Sans 3", "Segoe UI", sans-serif';
  ctx.fillStyle = "#545c57";
  ctx.fillText("Gauge signal", 4, 15);
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (const value of [0, 0.5, 1, 1.5, 2]) {
    ctx.strokeStyle = "#dce1dd";
    ctx.beginPath();
    ctx.moveTo(left, y(value));
    ctx.lineTo(right, y(value));
    ctx.stroke();
    ctx.fillText(String(value), left - 8, y(value));
  }
  ctx.textAlign = "center";
  for (let step = 0; step <= steps; step++) ctx.fillText(String(step), x(step), bottom + 15);
  ctx.fillText("Forecast step", (left + right) / 2, height - 10);

  for (const [values, color, dash] of [[high, "#224d3f", []], [low, "#3f4642", [2, 4]], [mean, "#626963", [7, 5]]]) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(x(0), y(values[0]));
    for (let step = 1; step <= steps; step++) ctx.lineTo(x(step), y(values[step]));
    ctx.stroke();
  }
}

forcing.addEventListener("input", draw);
gauge.addEventListener("change", draw);
new ResizeObserver(draw).observe(canvas);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw).catch(() => {});
draw();
