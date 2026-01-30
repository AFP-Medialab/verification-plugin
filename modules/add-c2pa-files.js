import { resolve } from "node:path";
import { defineWxtModule } from "wxt/modules";

export default defineWxtModule((wxt) => {
  wxt.hook("build:publicAssets", (_, assets) => {
    assets.push({
      absoluteSrc: resolve(
        "node_modules/c2pa/dist/assets/wasm/toolkit_bg.wasm",
      ),
      relativeDest: "c2paAssets/toolkit_bg.wasm",
    });

    assets.push({
      absoluteSrc: resolve("node_modules/c2pa/dist/c2pa.worker.min.js"),
      relativeDest: "c2paAssets/c2pa.worker.min.js",
    });
  });
});
