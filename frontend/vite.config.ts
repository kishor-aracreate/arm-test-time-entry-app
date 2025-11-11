import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import { federation } from "@module-federation/vite";
import { dependencies } from "./package.json";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      react(),
      UnoCSS(),
      federation({
        name: "timer",
        filename: "remoteEntry.js",
        exposes: {
          "./Dashboard": "./src/pages/Dashboard.tsx",
          "./Projects": "./src/pages/Projects.tsx",
          "./TimeEntries": "./src/pages/TimeEntries.tsx",
          "./Debug": "./src/pages/Debug.tsx",
        },
        remotes: {
          core: {
            type: "esm",
            name: "core",
            entry: "http://localhost:3000/remoteEntry.js",
            entryGlobalName: "core",
            shareScope: "default",
          },
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: dependencies.react,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: dependencies["react-dom"],
          },
          "react-router-dom": {
            singleton: true,
            requiredVersion: dependencies["react-router-dom"],
          },
        },
      }),
    ],

    server: {
      port: Number(env.VITE_PORT),
      strictPort: true,
      cors: true,
    },

    optimizeDeps: {
      include: ["react", "react-dom"],
      force: true,
    },

    build: {
      target: "esnext",
      modulePreload: false,
      minify: false,
    },
  };
});
