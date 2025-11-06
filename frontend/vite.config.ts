import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import UnoCSS from 'unocss/vite';
// import { federation } from '@module-federation/vite' // Uncomment when using module federation
// import { dependencies } from './package.json';

/**
 * Vite configuration file
 * ------------------------
 * - Uses React + TypeScript with Vite.
 * - UnoCSS included for atomic CSS utilities.
 * - Aliases `@` to the `src` folder for cleaner imports.
 *
 * ⚡ Notes for developers:
 * - Module Federation is included below but commented out.
 *   Uncomment when you need to expose/consume remote modules.
 * - Keep dependencies aligned with `package.json` to avoid mismatched versions.
 */
export default defineConfig(() => {
  return {
    plugins: [
      react(),
      UnoCSS(),

      /**
       * 🔗 Module Federation Setup (disabled by default)
       * -------------------------------------------------
       * Uncomment this block if you need to expose or consume modules across apps.
       * Example use case: Microfrontend architecture.
       */
      /*
      federation({
        name: 'template',              // Unique name for this application
        filename: 'remoteEntry.js',    // Output file for remote entry
        exposes: {
          './App': './src/App.tsx',    // Expose components/modules for others to consume
        },
        remotes: {
          core: {
            type: 'module',
            name: 'core',
            entry: 'http://localhost:3000/remoteEntry.js',
            shareScope: 'default',
            entryGlobalName: 'core',
          },
        },
        shared: {
          react: {
            requiredVersion: dependencies.react,
            singleton: true,           // Ensure only one React instance is loaded
          },
          'react-dom': {
            requiredVersion: dependencies['react-dom'],
            singleton: true,
          },
          'react-router-dom': {
            requiredVersion: dependencies['react-router-dom'],
            singleton: true,
          },
        },
      }),
      */
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});
