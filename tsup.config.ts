import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/main.ts"],

  format: ["esm"],
  target: "esnext",
  platform: "neutral",

  dts: true,
  removeNodeProtocol: false,
  sourcemap: true,
  clean: true,
})
