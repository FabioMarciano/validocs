/**
 * Validocs - library for document and pattern validation.
 * Module: CNPJ (Cadastro Nacional de Pessoas Jurídicas)
 */

/**
 * Regular expression to match digits only
 * @constant
 */
const cnpjDigitRegex = /[^\d]/g;

/**
 * Regular expression to match strict formated CNPJ
 * @constant
 */
const cnpjStrictRegex = /[\d]{2}\.[\d]{3}\.[\d]{3}\/[\d]{4}-[\d]{2}/g;

/**
 * CNPJ base length (without digits)
 * @constant
 */
const cnpjBaseLength = 8;

/**
 * CNPJ branches length
 * @constant
 */
const cnpjBranchesLength = 4;

/**
 * CNPJ digit length
 * @constant
 */
const cnpjDigitLength = 2;

/**
 * CNPJ unmasked length (with digits)
 * @constant
 */
export const CNPJ_UNMASKED_LENGTH: number = cnpjBaseLength + cnpjBranchesLength + cnpjDigitLength;

/**
 * CNPJ formated length (with digits)
 * @constant
 */
export const CNPJ_FORMATED_LENGTH: number = CNPJ_UNMASKED_LENGTH + 4;

/**
 * The CNPJ Number type definition
 * @type string
 */
export type Cnpj = string;

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
	branches?: number;
}

/**
 * Formats a given CNPJ
 * @param { Cnpj } cnpj - the CNPJ to mask
 * @returns { Cnpj } - the formated value
 */
export function format(cnpj: Cnpj): Cnpj {
	const base = cnpj.replace(/[^\d]/g, '');

	if (base.length !== CNPJ_UNMASKED_LENGTH) {
		return mask(base);
	}

	return base.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

/**
 * Masks a given (even partial) CNPJ
 * @param { Cnpj } cnpj - the CNPJ to mask
 * @returns { Cnpj } - the masked value
 */
export function mask(cnpj: Cnpj): Cnpj {
	return cnpj
		.replace(/\D/g, '')
		.replace(/(\d{2})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d{1,4})/, '$1/$2')
		.replace(/(\d{4})(\d{1,2})/, '$1-$2')
		.replace(/(-\d{2})\d+?$/, '$1');
}

/**
 * Unmask the CNPJ
 * @param { Cnpj } cnpj - the CNPJ to unmask
 * @returns { Cnpj } - the cleaned CNPJ string (only numbers)
 */
export function unmask(cnpj: Cnpj): Cnpj {
	return cnpj.replace(cnpjDigitRegex, '');
}

/**
 * Checks if CNPJ is a sequence
 * @param { Cnpj } cnpj - the CNPJ to test
 * @returns { boolean } CNPJ is a sequence
 */
export function sequence(cnpj: Cnpj): boolean {
	return new Array<number>(14)
		.fill(0)
		.some((_: number, index: number) =>
			new RegExp(`${index}{${CNPJ_UNMASKED_LENGTH}}`).test(cnpj.replace(cnpjDigitRegex, ''))
		);
}

/**
 * Tests if CNPJ is valid
 * @param { Cnpj } cnpj - the CNPJ to test
 * @param { Options } options options to test CNPJ
 * @param { boolean } [options.strict=true] consider only valid and well-formed masked CNPJs
 * @returns { boolean } CNPJ is valid
 */
export function test(cnpj: Cnpj, { strict = false }: Options = {}): boolean {
	const base = cnpj.replace(cnpjDigitRegex, '');

	/** CNPJ length must be 14 and must not be a sequence */
	if (base.length !== 14 || sequence(base)) {
		return false;
	}

	let vd = `${digit(base.substr(0, cnpjBaseLength + cnpjBranchesLength))}`;
	vd += `${digit(base.substr(0, cnpjBaseLength + cnpjBranchesLength) + vd)}`;

	return vd === base.substr(-cnpjDigitLength) && (strict ? cnpjStrictRegex.test(cnpj) : true);
}

/**
 * Gets the CNPJ branches number
 * @param { Cnpj } cnpj
 * @param { Options } options options
 * @param { boolean } [options.strict=true] also tests if the CNPJ is valid
 * @returns {number | undefined} number of branches
 */
export function branches(cnpj: Cnpj, { strict = false }: Options = {}): number | undefined {
	const base = cnpj.replace(cnpjDigitRegex, '');

	if ((strict && !test(base)) || base.length !== CNPJ_UNMASKED_LENGTH) {
		return undefined;
	}

	return Number(base.substr(cnpjBaseLength, cnpjBranchesLength));
}

/**
 * Makes a new random CNPJ
 * @param { ExtendedOptions } options
 * @param { boolean } [options.strict=true] CNPJ formated string
 * @param { Banches } options.branches the CNPJ branches count
 * @returns { Cnpj } random CNPJ
 */
export function make({ strict = true, branches = 1 }: ExtendedOptions = {}): Cnpj {
	let base: Cnpj = [
		...new Array<number>(8).fill(0).map(() => Math.floor(Math.random() * 9)),
		...[
			...Array(cnpjBranchesLength - branches.toString().split('').slice(0, cnpjBranchesLength).length).fill(0),
			...branches.toString().split('').slice(0, cnpjBranchesLength)
		]
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
	const mul = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
	const mod = 11;
	const digit =
		[
			...new Array(13 - base.replace(cnpjDigitRegex, '').length).fill('0'),
			...base.replace(cnpjDigitRegex, '').split('')
		]
			.map((number, index) => Number(number) * Number(mul[index]))
			.reduce((accumulator, number) => (accumulator += number)) % mod;

	return [mod - digit, 0][Number(digit < cnpjDigitLength)];
}
