/**
 * pis spec file
 **/

import { PIS } from '../src';

describe('PIS', () => {
	describe('format', () => {
		test('Should format a given full length Pis', () => {
			const pis: PIS.Pis = '11111111111';
			const expected: PIS.Pis = '111.11111.11-1';
			expect(PIS.format(pis)).toBe(expected);
		});

		test('Should format a given partial length Pis', () => {
			const pis: PIS.Pis = '1111111111';
			const expected: PIS.Pis = '111.11111.11';
			expect(PIS.format(pis)).toBe(expected);
		});
	});

	describe('mask', () => {
		test('Should mask a given full length Pis', () => {
			const pis: PIS.Pis = '11111111111';
			const expected: PIS.Pis = '111.11111.11-1';
			expect(PIS.mask(pis)).toBe(expected);
		});

		test('Should mask a given partial length Pis', () => {
			const pis: PIS.Pis = '1111111111';
			const expected: PIS.Pis = '111.11111.11';
			expect(PIS.mask(pis)).toBe(expected);
		});
	});

	describe('unmask', () => {
		test('Should unmask a given full length Pis', () => {
			const pis: PIS.Pis = '111.11111.11-1';
			const expected: PIS.Pis = '11111111111';
			expect(PIS.unmask(pis)).toBe(expected);
		});

		test('Should unmask a given partial length Pis', () => {
			const pis: PIS.Pis = '111.11111.11';
			const expected: PIS.Pis = '1111111111';
			expect(PIS.unmask(pis)).toBe(expected);
		});
	});

	describe('sequence', () => {
		test('Should return true for a given sequence PIS.Pis', () => {
			const pis: PIS.Pis = '111.11111.11-1';
			const expected = true;
			expect(PIS.sequence(pis)).toBe(expected);
		});

		test('Should return false for a given non-sequence PIS.Pis', () => {
			const pis: PIS.Pis = '123.45678.90-1';
			const expected = false;
			expect(PIS.sequence(pis)).toBe(expected);
		});
	});

	describe('test', () => {
		test('Should return true for a given valid PIS.Pis (default Options)', () => {
			const pis: PIS.Pis = PIS.make();
			const expected = true;
			expect(PIS.test(pis)).toBe(expected);
		});

		test('Should return true for a given valid PIS.Pis (Options strict = true)', () => {
			const pis: PIS.Pis = PIS.make();
			const expected = true;
			expect(PIS.test(pis, { strict: true })).toBe(expected);
		});

		test('Should return false for a given valid but not-well-formed PIS.Pis (Options strict = true)', () => {
			const pis: PIS.Pis = PIS.unmask(PIS.make());
			const expected = false;
			expect(PIS.test(pis, { strict: true })).toBe(expected);
		});

		test('Should return false for a given non-valid PIS.Pis (default Options)', () => {
			const pis: PIS.Pis = '111.11111.11-1';
			const expected = false;
			expect(PIS.test(pis)).toBe(expected);
		});

		test('Should return false for a given non-valid and not-well-formed PIS.Pis (Options strict = true)', () => {
			const pis: PIS.Pis = '11111111111';
			const expected = false;
			expect(PIS.test(pis, { strict: true })).toBe(expected);
		});
	});

	describe('make', () => {
		test('Should make a new random formated (by default) Pis', () => {
			const pis: PIS.Pis = PIS.make();
			expect(pis.length).toBe(PIS.FORMATED_LENGTH);
		});

		test('Should make a new random unmasked Pis', () => {
			const pis: PIS.Pis = PIS.make({ strict: false });
			expect(pis.length).toBe(PIS.UNMASKED_LENGTH);
		});
	});

	describe('digit', () => {
		test('Should return the correct digit for a given base PIS.Pis', () => {
			const pis: PIS.Pis = PIS.make({ strict: false });
			const expected = Number(pis.slice(-1));
			expect(PIS.digit(pis.slice(0, 10))).toBe(expected);
		});
	});
});
