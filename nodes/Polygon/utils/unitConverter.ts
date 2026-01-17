/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Unit Converter Utilities
 * Convert between different Ethereum units
 */

import { formatUnits, parseUnits, formatEther, parseEther } from 'ethers';

/**
 * Convert wei to ether
 */
export function weiToEther(wei: string | bigint, decimals: number = 18): string {
	return formatUnits(wei, decimals);
}

/**
 * Convert ether to wei
 */
export function etherToWei(ether: string, decimals: number = 18): bigint {
	return parseUnits(ether, decimals);
}

/**
 * Format MATIC amount from wei
 */
export function formatMatic(wei: string | bigint): string {
	return formatEther(wei);
}

/**
 * Parse MATIC amount to wei
 */
export function parseMatic(matic: string): bigint {
	return parseEther(matic);
}

/**
 * Format token amount from smallest unit
 */
export function formatTokenAmount(
	amount: string | bigint,
	decimals: number,
	displayDecimals?: number
): string {
	const formatted = formatUnits(amount, decimals);
	
	if (displayDecimals !== undefined) {
		const num = parseFloat(formatted);
		return num.toFixed(displayDecimals);
	}
	
	return formatted;
}

/**
 * Parse token amount to smallest unit
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
	return parseUnits(amount, decimals);
}

/**
 * Convert gwei to wei
 */
export function gweiToWei(gwei: string | number): bigint {
	return parseUnits(gwei.toString(), 'gwei');
}

/**
 * Convert wei to gwei
 */
export function weiToGwei(wei: string | bigint): string {
	return formatUnits(wei, 'gwei');
}

/**
 * Format gas price for display
 */
export function formatGasPrice(wei: string | bigint): string {
	const gwei = weiToGwei(wei);
	return `${parseFloat(gwei).toFixed(2)} Gwei`;
}

/**
 * Calculate transaction cost in wei
 */
export function calculateTransactionCost(gasLimit: string | bigint, gasPrice: string | bigint): bigint {
	return BigInt(gasLimit) * BigInt(gasPrice);
}

/**
 * Format transaction cost for display
 */
export function formatTransactionCost(
	gasLimit: string | bigint,
	gasPrice: string | bigint,
	symbol: string = 'MATIC'
): string {
	const costWei = calculateTransactionCost(gasLimit, gasPrice);
	const costEther = weiToEther(costWei, 6);
	return `${costEther} ${symbol}`;
}

/**
 * Format large number with thousands separator
 */
export function formatLargeNumber(num: string | number | bigint): string {
	return BigInt(num).toLocaleString();
}

/**
 * Convert hex string to decimal
 */
export function hexToDecimal(hex: string): bigint {
	return BigInt(hex);
}

/**
 * Convert decimal to hex string
 */
export function decimalToHex(decimal: string | number | bigint): string {
	return '0x' + BigInt(decimal).toString(16);
}
