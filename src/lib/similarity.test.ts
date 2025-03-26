import { describe, expect, test } from "vitest";
import { getRangeMidpoint, isWithinRange } from "./similarity";

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
	describe("getRangeMidpoint", () => {
		test("returns the midpoint of the range", () => {
			expect(getRangeMidpoint([0, 10])).toBe(5);
		});
		test("returns the midpoint of the range with negative numbers", () => {
			expect(getRangeMidpoint([-10, 10])).toBe(0);
		});
		test("returns the midpoint of the range with decimal numbers", () => {
			expect(getRangeMidpoint([0.5, 1.5])).toBe(1);
		});
	});
});
