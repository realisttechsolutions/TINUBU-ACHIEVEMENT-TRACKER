import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/test/setup.ts",
        // Each database suite owns a PGlite WebAssembly runtime. Serial files
        // prevent parallel workers from exhausting constrained CI/Cloud Build memory.
        fileParallelism: false,
        maxWorkers: 1,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
