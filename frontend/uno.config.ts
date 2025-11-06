import { defineConfig } from 'unocss'
import presetWind4 from '@unocss/preset-wind4'
// Optional presets if needed later
// import presetAttributify from '@unocss/preset-attributify'
// import presetIcons from '@unocss/preset-icons'

/**
 * UnoCSS Configuration
 * ---------------------
 * - Preset: Wind v4 (utility-first CSS, similar to Tailwind v4).
 * - Scans `.ts` and `.tsx` files in `src/` for class usage.
 *
 * ✅ Common gotchas:
 * - Do NOT add spaces inside `{ts,tsx}` → must be exactly like `{ts,tsx}`.
 * - Always keep `exclude` for `node_modules` & `dist` to avoid slow builds.
 */
export default defineConfig({
  presets: [
    presetWind4(),
    // presetAttributify(), // enable if you want attribute-based utilities
    // presetIcons(),       // enable if you want icon utilities
  ],
  content: {
    pipeline: {
      include: [
        'src/**/*.{ts,tsx}', 
      ],
      exclude: [
        'node_modules',
        'dist',
      ],
    },
  },
})

