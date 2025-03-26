import { describe, expect, test } from "vitest";
import { isWithinRange } from "./similarity";

describe("similarity utils", () => {
	describe("isWithinRange", () => {
		test("returns true if value is within range", () => {
			expect(isWithinRange(5, [0, 10])).toBe(true);
		});
		test("returns false if value is outside range", () => {
			expect(isWithinRange(15, [0, 10])).toBe(false);
		});
		test("should handle unsorted ranges", () => {
			expect(isWithinRange(5, [10, 0])).toBe(true);
		});
		test("should handle undefined score", () => {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			expect(isWithinRange(undefined as any, [0, 10])).toBe(false);
		});
	});
});
