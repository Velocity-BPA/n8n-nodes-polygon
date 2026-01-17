/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Address Utilities
 * Ethereum address validation and manipulation
 */

import { getAddress, isAddress } from 'ethers';

/**
 * Validate an Ethereum address
 */
export function validateAddress(address: string): boolean {
	return isAddress(address);
}

/**
 * Get checksummed address
 */
export function checksumAddress(address: string): string {
	if (!validateAddress(address)) {
		throw new Error(`Invalid address: ${address}`);
	}
	return getAddress(address);
}

/**
 * Compare two addresses (case-insensitive)
 */
export function addressesEqual(address1: string, address2: string): boolean {
	if (!validateAddress(address1) || !validateAddress(address2)) {
		return false;
	}
	return getAddress(address1) === getAddress(address2);
}

/**
 * Check if address is zero address
 */
export function isZeroAddress(address: string): boolean {
	return addressesEqual(address, '0x0000000000000000000000000000000000000000');
}

/**
 * Check if address is a contract (has code)
 */
export async function isContract(
	provider: import('ethers').Provider,
	address: string
): Promise<boolean> {
	const code = await provider.getCode(address);
	return code !== '0x';
}

/**
 * Shorten address for display
 */
export function shortenAddress(address: string, chars: number = 4): string {
	if (!validateAddress(address)) {
		return address;
	}
	const checksummed = getAddress(address);
	return `${checksummed.slice(0, chars + 2)}...${checksummed.slice(-chars)}`;
}

/**
 * Parse address from various formats
 */
export function parseAddress(input: string): string {
	// Remove whitespace
	const trimmed = input.trim();
	
	// Check if it's already a valid address
	if (validateAddress(trimmed)) {
		return checksumAddress(trimmed);
	}
	
	// Try to extract address from common formats
	const addressMatch = trimmed.match(/0x[a-fA-F0-9]{40}/);
	if (addressMatch) {
		return checksumAddress(addressMatch[0]);
	}
	
	throw new Error(`Could not parse address from input: ${input}`);
}
