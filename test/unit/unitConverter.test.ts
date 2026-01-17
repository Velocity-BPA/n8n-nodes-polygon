/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	weiToEther,
	etherToWei,
	formatMatic,
	parseMatic,
	formatTokenAmount,
	parseTokenAmount,
	gweiToWei,
	weiToGwei,
	formatGasPrice,
	calculateTransactionCost,
	hexToDecimal,
	decimalToHex,
} from '../../nodes/Polygon/utils/unitConverter';

describe('unitConverter', () => {
	describe('weiToEther', () => {
		it('should convert wei to ether', () => {
			expect(weiToEther('1000000000000000000')).toBe('1.0');
			expect(weiToEther(BigInt('1000000000000000000'))).toBe('1.0');
		});

		it('should handle custom decimals', () => {
			expect(weiToEther('1000000', 6)).toBe('1.0');
		});
	});

	describe('etherToWei', () => {
		it('should convert ether to wei', () => {
			expect(etherToWei('1')).toBe(BigInt('1000000000000000000'));
			expect(etherToWei('0.5')).toBe(BigInt('500000000000000000'));
		});
	});

	describe('formatMatic', () => {
		it('should format MATIC from wei', () => {
			expect(formatMatic('1000000000000000000')).toBe('1.0');
		});
	});

	describe('parseMatic', () => {
		it('should parse MATIC to wei', () => {
			expect(parseMatic('1')).toBe(BigInt('1000000000000000000'));
		});
	});

	describe('formatTokenAmount', () => {
		it('should format token amounts with decimals', () => {
			expect(formatTokenAmount('1000000', 6)).toBe('1.0');
			expect(formatTokenAmount('1000000', 6, 2)).toBe('1.00');
		});
	});

	describe('parseTokenAmount', () => {
		it('should parse token amounts to smallest unit', () => {
			expect(parseTokenAmount('1', 6)).toBe(BigInt('1000000'));
			expect(parseTokenAmount('1', 18)).toBe(BigInt('1000000000000000000'));
		});
	});

	describe('gweiToWei', () => {
		it('should convert gwei to wei', () => {
			expect(gweiToWei(1)).toBe(BigInt('1000000000'));
			expect(gweiToWei('30')).toBe(BigInt('30000000000'));
		});
	});

	describe('weiToGwei', () => {
		it('should convert wei to gwei', () => {
			expect(weiToGwei('1000000000')).toBe('1.0');
			expect(weiToGwei(BigInt('30000000000'))).toBe('30.0');
		});
	});

	describe('formatGasPrice', () => {
		it('should format gas price in Gwei', () => {
			expect(formatGasPrice('30000000000')).toMatch(/30.*Gwei/);
		});
	});

	describe('calculateTransactionCost', () => {
		it('should calculate transaction cost', () => {
			const gasLimit = BigInt(21000);
			const gasPrice = BigInt('30000000000');
			expect(calculateTransactionCost(gasLimit, gasPrice)).toBe(BigInt('630000000000000'));
		});
	});

	describe('hexToDecimal', () => {
		it('should convert hex to decimal', () => {
			expect(hexToDecimal('0x89')).toBe(BigInt(137));
			expect(hexToDecimal('0x1')).toBe(BigInt(1));
		});
	});

	describe('decimalToHex', () => {
		it('should convert decimal to hex', () => {
			expect(decimalToHex(137)).toBe('0x89');
			expect(decimalToHex(BigInt(1))).toBe('0x1');
		});
	});
});
