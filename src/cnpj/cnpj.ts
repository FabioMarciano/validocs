/**
 * Validocs - library for document and pattern validation.
 * Module: CNPJ (Cadastro Nacional de Pessoas Jurídicas)
 */

/**
 * Cnpj calculation base
 * @constant
 */
const cnpjCalculationBase = 36;

/**
 * Ascii offset for digits calculation
 * @constant
 */
const cnpjAsciiOffsetValue = 48;

/**
 * Regular expression to match digits and alpha characters only
 * @constant
 */
const cnpjDigitRegex = /[^\dA-Z]/gi;

/**
 * Regular expression to match strict formated CNPJ
 * @constant
 */
const cnpjStrictRegex = /[\dA-Z]{2}\.[\dA-Z]{3}\.[\dA-Z]{3}\/[\dA-Z]{4}-[\d]{2}/gi;

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
export const UNMASKED_LENGTH: number = cnpjBaseLength + cnpjBranchesLength + cnpjDigitLength;

/**
 * CNPJ formated length (with digits)
 * @constant
 */
export const FORMATED_LENGTH: number = UNMASKED_LENGTH + 4;

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
	const base = cnpj.toUpperCase().replace(/[^\dA-Z]/gi, '');
	if (base.length !== UNMASKED_LENGTH) {
		return mask(base);
	}

	return base.replace(/^([\dA-Z]{2})([\dA-Z]{3})([\dA-Z]{3})([\dA-Z]{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

/**
 * Masks a given (even partial) CNPJ
 * @param { Cnpj } cnpj - the CNPJ to mask
 * @returns { Cnpj } - the masked value
 */
export function mask(cnpj: Cnpj): Cnpj {
	return cnpj
		.toUpperCase()
		.replace(/[^\dA-Z]/gi, '')
		.replace(/([\dA-Z]{2})([\dA-Z])/, '$1.$2')
		.replace(/([\dA-Z]{3})([\dA-Z])/, '$1.$2')
		.replace(/([\dA-Z]{3})([\dA-Z]{1,4})/, '$1/$2')
		.replace(/([\dA-Z]{4})([\dA-Z]{1,2})/, '$1-$2')
		.replace(/(-[\dA-Z]{2})[\dA-Z]+?$/, '$1');
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
	const base = cnpj.replace(cnpjDigitRegex, '').split('');
	return !base.some((char: string) => char !== base[0]);
}

/**
 * Tests if CNPJ is valid
 * @param { Cnpj } cnpj - the CNPJ to test
 * @param { Options } options options to test CNPJ
 * @param { boolean } [options.strict=true] consider only valid and well-formed masked CNPJs
 * @returns { boolean } CNPJ is valid
 */
export function test(cnpj: Cnpj, { strict = false }: Options = {}): boolean {
	const base = cnpj.toUpperCase().replace(cnpjDigitRegex, '');
	const size = cnpjBaseLength + cnpjBranchesLength + cnpjDigitLength;

	/** CNPJ length must be 14 and must not be a sequence */
	if (base.length !== size || sequence(base)) {
		return false;
	}

	let vd = `${digit(base.slice(0, cnpjBaseLength + cnpjBranchesLength))}`;
	vd += `${digit(base.slice(0, cnpjBaseLength + cnpjBranchesLength) + vd)}`;

	return vd === base.slice(-cnpjDigitLength) && (strict ? cnpjStrictRegex.test(cnpj) : true);
}

/**
 * Gets the CNPJ branches number
 * @param { Cnpj } cnpj
 * @param { Options } options options
 * @param { boolean } [options.strict=true] also tests if the CNPJ is valid
 * @returns {number | undefined} number of branches
 */
export function branches(cnpj: Cnpj, { strict = false }: Options = {}): number | undefined {
	const base = cnpj.toUpperCase().replace(cnpjDigitRegex, '');

	if ((strict && !test(base)) || base.length !== UNMASKED_LENGTH) {
		return undefined;
	}

	return Number(parseInt(base.slice(cnpjBaseLength, cnpjBaseLength + cnpjBranchesLength), cnpjCalculationBase));
}

/**
 * Makes a new random CNPJ
 * @param { ExtendedOptions } options
 * @param { boolean } [options.strict=true] CNPJ formated string
 * @param { Banches } options.branches the CNPJ branches count
 * @returns { Cnpj } random CNPJ
 */
export function make({ strict = true, branches = 1 }: ExtendedOptions = {}): Cnpj {
	const charEnabledList = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
	let base: Cnpj = [
		...new Array<number>(cnpjBaseLength)
			.fill(0)
			.map(() => charEnabledList[Math.floor(Math.random() * charEnabledList.length)]),
		...[
			...Array(
				cnpjBranchesLength -
					parseInt(`${branches}`, cnpjCalculationBase).toString().split('').slice(0, cnpjBranchesLength).length
			).fill(0),
			...parseInt(`${branches}`, cnpjCalculationBase).toString().split('').slice(0, cnpjBranchesLength)
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
			...new Array(mul.length - base.replace(cnpjDigitRegex, '').length).fill('0'),
			...base.replace(cnpjDigitRegex, '').split('')
		]
			.map((char, index) => Number(char.toUpperCase().charCodeAt(0) - cnpjAsciiOffsetValue) * Number(mul[index]))
			.reduce((accumulator, number) => (accumulator += number)) % mod;

	return [mod - digit, 0][Number(digit < cnpjDigitLength)];
}
