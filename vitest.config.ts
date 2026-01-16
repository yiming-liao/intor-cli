import path from "node:path";
// import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // plugins: [tsconfigPaths(),],
  test: {
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      reporter: ["lcov", "text"],
      exclude: ["**/__fixtures__/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
