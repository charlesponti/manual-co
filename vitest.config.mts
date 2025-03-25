import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		globals: true,
		environment: "jsdom",
		clearMocks: true,
		include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
		exclude: [".next", "node_modules", "coverage", "dist", "e2e/**/*.spec.ts"],
		coverage: {
			provider: "v8",
			clean: true,
			enabled: true,
			exclude: ["src/**/*.spec.{ts,tsx}", "src/**/*.test.{ts,tsx}"],
			reporter: ["lcov"],
			reportsDirectory: "coverage",
		},
	},
});
