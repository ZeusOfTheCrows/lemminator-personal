import { describe, expect, it } from "vitest";
import { formatApproxInteger } from "./format";

describe('format integer approximately', () => {
    it('formats positive short numbers', () => {
        expect(formatApproxInteger(4)).toBe('4');
        expect(formatApproxInteger(999)).toBe('999');
    })

    it('formats negative short numbers', () => {
        expect(formatApproxInteger(-999)).toBe('-999');
    })

    it('formats numbers of >= 1.000 <= 1.000.000', () => {
        expect(formatApproxInteger(1000)).toBe('1k');
        expect(formatApproxInteger(1499)).toBe('1k+');
        expect(formatApproxInteger(1999)).toBe('1k+');
        expect(formatApproxInteger(999999)).toBe('999k+');
    })

    it('formats numbers of >= -1.000.000 <= - 1.000', () => {
        expect(formatApproxInteger(-1000)).toBe('-1k');
        expect(formatApproxInteger(-1999)).toBe('< -1k');
        expect(formatApproxInteger(-999999)).toBe('< -999k');
    })

    it('formats numbers of >= 1.000.000', () => {
        expect(formatApproxInteger(1_000_000)).toBe('1m');
        expect(formatApproxInteger(1_999_999)).toBe('1m+');
        expect(formatApproxInteger(999_999_999)).toBe('999m+');
    })

    it('formats numbers of <= -1.000.000', () => {
        expect(formatApproxInteger(-1_000_000)).toBe('-1m');
        expect(formatApproxInteger(-1_999_999)).toBe('< -1m');
        expect(formatApproxInteger(-999_999_999)).toBe('< -999m');
    })

    it('formats 0', () => {
        expect(formatApproxInteger(0)).toBe('0');
    })
});