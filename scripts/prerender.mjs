import { readFile, writeFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

const vite = await createServer({
  server: { middlewareMode: true, watch: null },
  appType: "custom",
});
try {
  const { default: App } = await vite.ssrLoadModule("/src/App.jsx");
  const output = new URL("../dist/index.html", import.meta.url);
  const html = await readFile(output, "utf8");
  const root = '<div id="root"></div>';
  if (!html.includes(root)) throw new Error("Homepage root is missing from the build.");
  await writeFile(output, html.replace(root, () => '<div id="root">' + renderToString(createElement(App)) + "</div>"));
} finally {
  await vite.close();
}
