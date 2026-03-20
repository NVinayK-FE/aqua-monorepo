import uiPreset from "@aqua/ui-core/tailwind"
import type { Config } from "tailwindcss"

const config: Config = {
    presets: [uiPreset],                            // inherit all design tokens
    content: [
        "./src/**/*.{ts,tsx}",
        "../../packages/ui-core/src/**/*.{ts,tsx}",   // scan ui-core package so Tailwind sees its classes
    ],
}
export default config
