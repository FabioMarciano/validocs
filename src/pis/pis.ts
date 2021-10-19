/**
 * Validocs - library for document and pattern validation.
 * Module: PIS (Programa de Integração Social)
 */

/**
 * Regular expression to match digits only
 * @constant
 */
const pisDigitRegex = /[^\d]/g;

/**
 * Regular expression to match strict formated PIS
 * @constant
 */
const pisStrictRegex = /[\d]{3}\.[\d]{5}\.[\d]{2}-[\d]{1}/g;

/**
 * PIS base length (without digits)
 * @constant
 */
const pisBaseLength = 10;

/**
 * PIS digit length
 * @constant
 */
const pisDigitLength = 1;

/**
 * PIS unmasked length (with digits)
 * @constant
 */
export const UNMASKED_LENGTH: number = pisBaseLength + pisDigitLength;

/**
 * PIS formated length (with digits)
 * @constant
 */
export const FORMATED_LENGTH: number = UNMASKED_LENGTH + 3;

/**
 * The PIS Number type definition
 * @type string
 */
export type Pis = string;

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
	region?: string;
}

/**
 * Formats a given PIS
 * @param { Pis } pis - the PIS to mask
 * @returns { Pis } - the formated value
 */
export function format(pis: Pis): Pis {
	const base = pis.replace(/[^\d]/g, '');

	if (base.length !== UNMASKED_LENGTH) {
		return mask(base);
	}

	return base.replace(/^(\d{3})(\d{5})(\d{2})(\d{1})$/, '$1.$2.$3-$4');
}

/**
 * Masks a given (even partial) PIS
 * @param { Pis } pis - the PIS to mask
 * @returns { Pis } - the masked value
 */
export function mask(pis: Pis): Pis {
	return pis
		.replace(/\D/g, '')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{5})(\d)/, '$1.$2')
		.replace(/(\d{2})(\d)\d{0,}?$/, '$1-$2');
}

/**
 * Unmask the PIS
 * @param { Pis } pis - the PIS to unmask
 * @returns { Pis } - the cleaned Pis string (only numbers)
 */
export function unmask(pis: Pis): Pis {
	return pis.replace(pisDigitRegex, '');
}

/**
 * Checks if PIS is a sequence
 * @param { Pis } pis - the PIS to test
 * @returns { boolean } PIS is a sequence
 */
export function sequence(pis: Pis): boolean {
	return new Array<number>(10)
		.fill(0)
		.some((_: number, index: number) =>
			new RegExp(`${index}{${UNMASKED_LENGTH}}`).test(pis.replace(pisDigitRegex, ''))
		);
}

/**
 * Tests if PIS is valid
 * @param { Pis } pis - the PIS to test
 * @param { Options } options options to test PIS
 * @param { boolean } [options.strict=false] consider both valid and non-well-formed masked PISs
 * @returns { boolean } PIS is valid
 */
export function test(pis: Pis, { strict = false }: Options = {}): boolean {
	const base = pis.replace(pisDigitRegex, '');

	/** PIS length must be 11 (UNMASKED_LENGTH) and must not be a sequence */
	if (base.length !== UNMASKED_LENGTH || sequence(base)) {
		return false;
	}

	const vd = `${digit(base.substr(0, pisBaseLength))}`;

	return vd === base.substr(-pisDigitLength) && (strict ? pisStrictRegex.test(pis) : true);
}

/**
 * Makes a new random PIS
 * @param { ExtendedOptions } options
 * @param { boolean } [options.strict=true] PIS formated string
 * @returns { Pis } random PIS
 */
export function make({ strict = true }: ExtendedOptions = {}): Pis {
	let base: Pis = [...new Array<number>(10).fill(0).map(() => Math.floor(Math.random() * 9))].join('');

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
	const mul = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
	const mod = 11;
	const digit =
		[
			...new Array(mul.length - base.replace(pisDigitRegex, '').length).fill('0'),
			...base.replace(pisDigitRegex, '').split('')
		]
			.map((number, index) => Number(number) * Number(mul[index]))
			.reduce((accumulator, number) => (accumulator += number)) % mod;

	return [mod - digit, 0][Number(digit <= 1)];
}
