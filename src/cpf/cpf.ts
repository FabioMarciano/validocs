/**
 * Validocs - document and pattern validator library.
 * Module: CPF (Cadastro de Pessoas Físicas)
 */

/**
 * Regular expression to match digits only
 * @constant
 */
const cpfDigitRegex = /[^\d]/g;

/**
 * Regular expression to match strict formated CPF
 * @constant
 */
const cpfStrictRegex = /[\d]{3}\.[\d]{3}\.[\d]{3}-[\d]{2}/g;

/**
 * CPF base length (without digits)
 * @constant
 */
const cpfBaseLength = 9;

/**
 * CPF full length (with digits)
 * @constant
 */
const cpfDigitLength = 2;

/**
 * Fiscal Region constant list
 * @constant
 */
export const CPF_FISCAL_REGION_DATA: string[][] = [
	['RS'],
	['DF', 'GO', 'MT', 'MS', 'TO'],
	['AC', 'AP', 'AM', 'PA', 'RO', 'RR'],
	['CE', 'MA', 'PI'],
	['AL', 'PB', 'PE', 'RN'],
	['BA', 'SE'],
	['MG'],
	['ES', 'RJ'],
	['SP'],
	['PR', 'SC']
];

/**
 * CPF index of fiscal region digit (unmasked)
 * @constant
 */
export const CPF_UNMASKED_FISCAL_REGION_DIGIT_INDEX = 8;

/**
 * CPF index of fiscal region digit (formated)
 * @constant
 */
export const CPF_FORMATED_FISCAL_REGION_DIGIT_INDEX = 10;

/**
 * CPF unmasked length (with digits)
 * @constant
 */
export const CPF_UNMASKED_LENGTH: number = cpfBaseLength + cpfDigitLength;

/**
 * CPF formated length (with digits)
 * @constant
 */
export const CPF_FORMATED_LENGTH: number = CPF_UNMASKED_LENGTH + 3;

/**
 * The CPF Number type definition
 * @type string
 */
export type Cpf = string;

/**
 * Fiscal Region enumeration
 * @enum
 */
export const enum FiscalRegion {
	FR01 = 1,
	FR02 = 2,
	FR03 = 3,
	FR04 = 4,
	FR05 = 5,
	FR06 = 6,
	FR07 = 7,
	FR08 = 8,
	FR09 = 9,
	FR10 = 0
}

/**
 * Basic options
 * @interface
 */
export interface Options {
	strict?: boolean;
}

/**
 * Extended options
 * @interface
 * @extends { Options }
 */
export interface ExtendedOptions extends Options {
	fiscalRegion?: FiscalRegion;
}

/**
 * Formats a given CPF
 * @param { Cpf } cpf - the CPF to mask
 * @returns { Cpf } - the formated value
 */
export function format(cpf: Cpf): Cpf {
	const base = cpf.replace(/[^\d]/g, '');

	if (base.length !== CPF_UNMASKED_LENGTH) {
		return mask(base);
	}

	return base.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

/**
 * Masks a given (even partial) CPF
 * @param { Cpf } cpf - the CPF to mask
 * @returns { Cpf } - the masked value
 */
export function mask(cpf: Cpf): Cpf {
	return cpf
		.replace(/\D/g, '')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d{1,2})/, '$1-$2')
		.replace(/(-\d{2})\d+?$/, '$1');
}

/**
 * Unmask the CPF
 * @param { Cpf } cpf - the CPF to unmask
 * @returns { Cpf } - the cleaned Cpf string (only numbers)
 */
export function unmask(cpf: Cpf): Cpf {
	return cpf.replace(cpfDigitRegex, '');
}

/**
 * Checks if CPF is a sequence
 * @param { Cpf } cpf - the CPF to test
 * @returns { boolean } CPF is a sequence
 */
export function sequence(cpf: Cpf): boolean {
	return new Array<number>(10)
		.fill(0)
		.some((_: number, index: number) =>
			new RegExp(`${index}{${CPF_UNMASKED_LENGTH}}`).test(cpf.replace(cpfDigitRegex, ''))
		);
}

/**
 * Tests if CPF is valid
 * @param { Cpf } cpf - the CPF to test
 * @param { Options } options options to test CPF
 * @param { boolean } [options.strict=true] consider only valid and well-formed masked CPFs
 * @returns { boolean } CPF is valid
 */
export function test(cpf: Cpf, { strict = false }: Options = {}): boolean {
	const base = cpf.replace(cpfDigitRegex, '');

	/** CPF length must be 11 and must not be a sequence */
	if (base.length !== CPF_UNMASKED_LENGTH || sequence(base)) {
		return false;
	}

	let vd = `${digit(base.substr(0, cpfBaseLength))}`;
	vd += `${digit(base.substr(0, cpfBaseLength) + vd)}`;

	return vd === base.substr(-cpfDigitLength) && (strict ? cpfStrictRegex.test(cpf) : true);
}

/**
 * Gets the CPF fiscal region
 * @param { Cpf } cpf
 * @param { Options } options options
 * @param { boolean } [options.strict=true] also tests if the CPF is valid
 * @returns {string | undefined} the fiscal region
 */
export function region(cpf: Cpf, { strict = false }: Options = {}): string | undefined {
	const base = cpf.replace(cpfDigitRegex, '');

	if (strict && !test(base)) {
		return undefined;
	}

	return base.length === CPF_UNMASKED_LENGTH
		? CPF_FISCAL_REGION_DATA[Number(base[CPF_UNMASKED_FISCAL_REGION_DIGIT_INDEX])].join(' ')
		: undefined;
}

/**
 * Makes a new random CPF
 * @param { ExtendedOptions } options
 * @param { boolean } [options.strict=true] CPF formated string
 * @param { FiscalRegion } options.fiscalRegion the CPF fiscal region
 * @returns { Cpf } random CPF
 */
export function make({ strict = true, fiscalRegion }: ExtendedOptions = {}): Cpf {
	let base: Cpf = [
		...new Array<number>(8).fill(0).map(() => Math.floor(Math.random() * 9)),
		fiscalRegion ?? Math.floor(Math.random() * 9)
	].join('');

	base += digit(base);
	base += digit(base);

	if (strict) {
		base = format(base);
	}

	return base;
}

/**
 * Gets one digit from a given base
 * @param { string } base the base to be used to calculate
 * @returns { number } the calculated digit
 */
export function digit(base: string): number {
	const digit =
		base
			.replace(cpfDigitRegex, '')
			.split('')
			.map((number, index, origin) => Number(number) * (origin.length + 1 - index))
			.reduce((accumulator, number) => accumulator + number) % 11;

	return [CPF_UNMASKED_LENGTH - digit, 0][Number(digit < cpfDigitLength)];
}
