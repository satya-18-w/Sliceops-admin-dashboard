import { expect, it } from 'vitest';
import { sum } from './app';

it("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3)
})


it("add 3 + 8 to be 11", () => {
    expect(sum(3, 8)).toBe(11)
})