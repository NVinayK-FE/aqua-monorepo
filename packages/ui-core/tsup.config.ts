import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["src/index.ts", "src/components/ui/*.tsx"],
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom"],
    treeshake: true,
    tsconfig: "tsconfig.json",
})
