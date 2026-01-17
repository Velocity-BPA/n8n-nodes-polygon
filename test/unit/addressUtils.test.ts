/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	validateAddress,
	checksumAddress,
	addressesEqual,
	isZeroAddress,
	shortenAddress,
	parseAddress,
} from '../../nodes/Polygon/utils/addressUtils';

describe('addressUtils', () => {
	const validAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f2b8E5';
	const validAddressLower = '0x742d35cc6634c0532925a3b844bc9e7595f2b8e5';
	const invalidAddress = '0x123';
	const zeroAddress = '0x0000000000000000000000000000000000000000';

	describe('validateAddress', () => {
		it('should return true for valid addresses', () => {
			expect(validateAddress(validAddress)).toBe(true);
			expect(validateAddress(validAddressLower)).toBe(true);
		});

		it('should return false for invalid addresses', () => {
			expect(validateAddress(invalidAddress)).toBe(false);
			expect(validateAddress('')).toBe(false);
			expect(validateAddress('not-an-address')).toBe(false);
		});
	});

	describe('checksumAddress', () => {
		it('should return checksummed address for valid input', () => {
			const result = checksumAddress(validAddressLower);
			expect(result).toBe(validAddress);
		});

		it('should throw for invalid addresses', () => {
			expect(() => checksumAddress(invalidAddress)).toThrow();
		});
	});

	describe('addressesEqual', () => {
		it('should return true for same addresses with different cases', () => {
			expect(addressesEqual(validAddress, validAddressLower)).toBe(true);
		});

		it('should return false for different addresses', () => {
			expect(addressesEqual(validAddress, zeroAddress)).toBe(false);
		});

		it('should return false for invalid addresses', () => {
			expect(addressesEqual(validAddress, invalidAddress)).toBe(false);
		});
	});

	describe('isZeroAddress', () => {
		it('should return true for zero address', () => {
			expect(isZeroAddress(zeroAddress)).toBe(true);
		});

		it('should return false for non-zero addresses', () => {
			expect(isZeroAddress(validAddress)).toBe(false);
		});
	});

	describe('shortenAddress', () => {
		it('should shorten valid addresses', () => {
			const result = shortenAddress(validAddress, 4);
			expect(result).toMatch(/^0x[a-fA-F0-9]{4}\.{3}[a-fA-F0-9]{4}$/);
		});

		it('should return original input for invalid addresses', () => {
			expect(shortenAddress(invalidAddress)).toBe(invalidAddress);
		});
	});

	describe('parseAddress', () => {
		it('should parse valid addresses', () => {
			expect(parseAddress(validAddressLower)).toBe(validAddress);
			expect(parseAddress(`  ${validAddress}  `)).toBe(validAddress);
		});

		it('should extract address from text', () => {
			const text = `Contract at ${validAddress} is deployed`;
			expect(parseAddress(text)).toBe(validAddress);
		});

		it('should throw for unparseable input', () => {
			expect(() => parseAddress('no address here')).toThrow();
		});
	});
});
