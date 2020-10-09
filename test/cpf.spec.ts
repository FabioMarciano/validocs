/**
 * cpf spec file
 **/

import { CPF } from '../src';

describe('CPF', () => {
	describe('format', () => {
		test('Should format a given full length Cpf', () => {
			const cpf: CPF.Cpf = '11111111111';
			const expected: CPF.Cpf = '111.111.111-11';
			expect(CPF.format(cpf)).toBe(expected);
		});

		test('Should format a given partial length Cpf', () => {
			const cpf: CPF.Cpf = '111111111';
			const expected: CPF.Cpf = '111.111.111';
			expect(CPF.format(cpf)).toBe(expected);
		});
	});

	describe('mask', () => {
		test('Should mask a given full length Cpf', () => {
			const cpf: CPF.Cpf = '11111111111';
			const expected: CPF.Cpf = '111.111.111-11';
			expect(CPF.mask(cpf)).toBe(expected);
		});

		test('Should mask a given partial length Cpf', () => {
			const cpf: CPF.Cpf = '111111111';
			const expected: CPF.Cpf = '111.111.111';
			expect(CPF.mask(cpf)).toBe(expected);
		});
	});

	describe('unmask', () => {
		test('Should unmask a given full length Cpf', () => {
			const cpf: CPF.Cpf = '111.111.111-11';
			const expected: CPF.Cpf = '11111111111';
			expect(CPF.unmask(cpf)).toBe(expected);
		});

		test('Should unmask a given partial length Cpf', () => {
			const cpf: CPF.Cpf = '111.111.111';
			const expected: CPF.Cpf = '111111111';
			expect(CPF.unmask(cpf)).toBe(expected);
		});
	});

	describe('sequence', () => {
		test('Should return true for a given sequence CPF.Cpf', () => {
			const cpf: CPF.Cpf = '111.111.111-11';
			const expected = true;
			expect(CPF.sequence(cpf)).toBe(expected);
		});

		test('Should return false for a given non-sequence CPF.Cpf', () => {
			const cpf: CPF.Cpf = '123.456.789-01';
			const expected = false;
			expect(CPF.sequence(cpf)).toBe(expected);
		});
	});

	describe('test', () => {
		test('Should return true for a given valid CPF.Cpf (default Options)', () => {
			const cpf: CPF.Cpf = CPF.make();
			const expected = true;
			expect(CPF.test(cpf)).toBe(expected);
		});

		test('Should return true for a given valid CPF.Cpf (Options strict = true)', () => {
			const cpf: CPF.Cpf = CPF.make();
			const expected = true;
			expect(CPF.test(cpf, { strict: true })).toBe(expected);
		});

		test('Should return false for a given valid but not-well-formed CPF.Cpf (Options strict = true)', () => {
			const cpf: CPF.Cpf = CPF.unmask(CPF.make());
			const expected = false;
			expect(CPF.test(cpf, { strict: true })).toBe(expected);
		});

		test('Should return false for a given non-valid CPF.Cpf (default Options)', () => {
			const cpf: CPF.Cpf = '111.111.111-11';
			const expected = false;
			expect(CPF.test(cpf)).toBe(expected);
		});

		test('Should return false for a given non-valid and not-well-formed CPF.Cpf (Options strict = true)', () => {
			const cpf: CPF.Cpf = '11111111111';
			const expected = false;
			expect(CPF.test(cpf, { strict: true })).toBe(expected);
		});
	});

	describe('region', () => {
		test('Should return the correct region for a given CPF.Cpf (Options default)', () => {
			const cpf: CPF.Cpf = CPF.make({ fiscalRegion: CPF.FiscalRegion.FR01 });
			const expected = CPF.CPF_FISCAL_REGION_DATA[CPF.FiscalRegion.FR01].join(' ');
			expect(CPF.region(cpf)).toBe(expected);
		});

		test('Should return the correct region for a given valid CPF.Cpf (Options strict = true)', () => {
			const cpf: CPF.Cpf = CPF.make({ strict: true, fiscalRegion: CPF.FiscalRegion.FR01 });
			const expected = CPF.CPF_FISCAL_REGION_DATA[CPF.FiscalRegion.FR01].join(' ');
			expect(CPF.region(cpf, { strict: true })).toBe(expected);
		});

		test('Should return undefined for a given non-full-length CPF.Cpf (Options default)', () => {
			const cpf: CPF.Cpf = '111.111.111';
			const expected = undefined;
			expect(CPF.region(cpf)).toBe(expected);
		});

		test('Should return undefined for a given non-valid CPF.Cpf (Options strict = true)', () => {
			const cpf: CPF.Cpf = '111.111.111-11';
			const expected = undefined;
			expect(CPF.region(cpf, { strict: true })).toBe(expected);
		});
	});

	describe('make', () => {
		test('Should make a new random formated (by default) Cpf', () => {
			const cpf: CPF.Cpf = CPF.make();
			expect(cpf.length).toBe(CPF.CPF_FORMATED_LENGTH);
		});

		test('Should make a new random unmasked Cpf', () => {
			const cpf: CPF.Cpf = CPF.make({ strict: false });
			expect(cpf.length).toBe(CPF.CPF_UNMASKED_LENGTH);
		});

		test('Should make a new random formated Cpf with given region', () => {
			const fiscalRegion: CPF.FiscalRegion = CPF.FiscalRegion.FR01;
			const cpf: CPF.Cpf = CPF.make({ strict: true, fiscalRegion: fiscalRegion });
			expect(cpf[CPF.CPF_FORMATED_FISCAL_REGION_DIGIT_INDEX]).toBe(`${fiscalRegion}`);
		});

		test('Should make a new random unmasked Cpf with given region', () => {
			const fiscalRegion: CPF.FiscalRegion = CPF.FiscalRegion.FR01;
			const cpf: CPF.Cpf = CPF.make({ strict: false, fiscalRegion: fiscalRegion });
			expect(cpf[CPF.CPF_UNMASKED_FISCAL_REGION_DIGIT_INDEX]).toBe(`${fiscalRegion}`);
		});
	});

	describe('digit', () => {
		test('Should return the correct digit for a given base CPF.Cpf', () => {
			const cpf: CPF.Cpf = CPF.make({ strict: false, fiscalRegion: CPF.FiscalRegion.FR01 });
			const expected = Number(cpf[9]);
			expect(CPF.digit(cpf.slice(0, 9))).toBe(expected);
		});
	});
});
