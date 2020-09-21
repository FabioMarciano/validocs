/**
 * cnpj spec file
 **/

import { CNPJ } from '../src';

describe('cnpj', () => {
	describe('format', () => {
		test('Should format a given full length Cnpj', () => {
			const cnpj: CNPJ.Cnpj = '11111111111111';
			const expected: CNPJ.Cnpj = '11.111.111/1111-11';
			expect(CNPJ.format(cnpj)).toBe(expected);
		});

		test('Should format a given partial length Cnpj', () => {
			const cnpj: CNPJ.Cnpj = '111111111';
			const expected: CNPJ.Cnpj = '11.111.111/1';
			expect(CNPJ.format(cnpj)).toBe(expected);
		});
	});

	describe('mask', () => {
		test('Should mask a given full length Cnpj', () => {
			const cnpj: CNPJ.Cnpj = '11111111111111';
			const expected: CNPJ.Cnpj = '11.111.111/1111-11';
			expect(CNPJ.mask(cnpj)).toBe(expected);
		});

		test('Should mask a given partial length Cnpj', () => {
			const cnpj: CNPJ.Cnpj = '111111111';
			const expected: CNPJ.Cnpj = '11.111.111/1';
			expect(CNPJ.mask(cnpj)).toBe(expected);
		});
	});

	describe('unmask', () => {
		test('Should unmask a given full length Cnpj', () => {
			const cnpj: CNPJ.Cnpj = '11.111.111/1111-11';
			const expected: CNPJ.Cnpj = '11111111111111';
			expect(CNPJ.unmask(cnpj)).toBe(expected);
		});

		test('Should unmask a given partial length Cnpj', () => {
			const cnpj: CNPJ.Cnpj = '11.111.111';
			const expected: CNPJ.Cnpj = '11111111';
			expect(CNPJ.unmask(cnpj)).toBe(expected);
		});
	});

	describe('sequence', () => {
		test('Should return true for a given sequence CNPJ.Cnpj', () => {
			const cnpj: CNPJ.Cnpj = '11.111.111/1111-11';
			const expected = true;
			expect(CNPJ.sequence(cnpj)).toBe(expected);
		});

		test('Should return false for a given non-sequence CNPJ.Cnpj', () => {
			const cnpj: CNPJ.Cnpj = '12.345.678/0009-01';
			const expected = false;
			expect(CNPJ.sequence(cnpj)).toBe(expected);
		});
	});

	describe('test', () => {
		test('Should return true for a given valid CNPJ.Cnpj (default Options)', () => {
			const cnpj: CNPJ.Cnpj = CNPJ.make();
			const expected = true;
			expect(CNPJ.test(cnpj)).toBe(expected);
		});

		test('Should return true for a given valid CNPJ.Cnpj (Options strict = true)', () => {
			const cnpj: CNPJ.Cnpj = CNPJ.make();
			const expected = true;
			expect(CNPJ.test(cnpj, { strict: true })).toBe(expected);
		});

		test('Should return false for a given valid but not-well-formed CNPJ.Cnpj (Options strict = true)', () => {
			const cnpj: CNPJ.Cnpj = CNPJ.unmask(CNPJ.make());
			const expected = false;
			expect(CNPJ.test(cnpj, { strict: true })).toBe(expected);
		});

		test('Should return false for a given non-valid CNPJ.Cnpj (default Options)', () => {
			const cnpj: CNPJ.Cnpj = '11.111.111/1111-11';
			const expected = false;
			expect(CNPJ.test(cnpj)).toBe(expected);
		});

		test('Should return false for a given non-valid and not-well-formed CNPJ.Cnpj (Options strict = true)', () => {
			const cnpj: CNPJ.Cnpj = '11111111111111';
			const expected = false;
			expect(CNPJ.test(cnpj, { strict: true })).toBe(expected);
		});
	});

	describe('make', () => {
		test('Should make a new random formated (by default) Cnpj', () => {
			const cnpj: CNPJ.Cnpj = CNPJ.make();
			expect(cnpj.length).toBe(CNPJ.CNPJ_FORMATED_LENGTH);
		});

		test('Should make a new random unmasked Cnpj', () => {
			const cnpj: CNPJ.Cnpj = CNPJ.make({ strict: false });
			expect(cnpj.length).toBe(CNPJ.CNPJ_UNMASKED_LENGTH);
		});

		test('Should make a new random formated Cnpj with given branch number', () => {
			const branches = 1;
			const cnpj: CNPJ.Cnpj = CNPJ.make({ strict: true, branches });
			expect(cnpj[14]).toBe(`${branches}`);
		});

		test('Should make a new random unmasked Cnpj with given branch number', () => {
			const branches = 1;
			const cnpj: CNPJ.Cnpj = CNPJ.make({ strict: false, branches });
			expect(cnpj[11]).toBe(`${branches}`);
		});
	});

	describe('digit', () => {
		test('Should return the correct digit for a given base CNPJ.Cnpj', () => {
			const cnpj: CNPJ.Cnpj = CNPJ.make({ strict: false, branches: 1 });
			const expected = Number(cnpj[12]);
			expect(CNPJ.digit(cnpj.slice(0, 12))).toBe(expected);
		});
	});
});
