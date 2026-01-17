/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * ABI Encoder Utilities
 * Encode and decode contract calls
 */

import { Interface, AbiCoder, keccak256, toUtf8Bytes, Fragment, FunctionFragment } from 'ethers';

const abiCoder = AbiCoder.defaultAbiCoder();

/**
 * Create an interface from ABI
 */
export function createInterface(abi: string | string[] | object[]): Interface {
	if (typeof abi === 'string') {
		try {
			const parsedAbi = JSON.parse(abi);
			return new Interface(parsedAbi);
		} catch {
			// Assume it's already in human-readable format
			return new Interface([abi]);
		}
	}
	return new Interface(abi as ReadonlyArray<string | object>);
}

/**
 * Encode function call data
 */
export function encodeFunctionCall(
	abi: string | string[] | object[],
	functionName: string,
	args: unknown[]
): string {
	const iface = createInterface(abi);
	return iface.encodeFunctionData(functionName, args);
}

/**
 * Decode function result
 */
export function decodeFunctionResult(
	abi: string | string[] | object[],
	functionName: string,
	data: string
): unknown {
	const iface = createInterface(abi);
	return iface.decodeFunctionResult(functionName, data);
}

/**
 * Encode function selector (4 bytes)
 */
export function encodeFunctionSelector(signature: string): string {
	return keccak256(toUtf8Bytes(signature)).slice(0, 10);
}

/**
 * Encode parameters without function selector
 */
export function encodeParameters(types: string[], values: unknown[]): string {
	return abiCoder.encode(types, values);
}

/**
 * Decode parameters
 */
export function decodeParameters(types: string[], data: string): unknown[] {
	const result = abiCoder.decode(types, data);
	return [...result];
}

/**
 * Parse event log
 */
export function parseEventLog(
	abi: string | string[] | object[],
	log: { topics: string[]; data: string }
): { name: string; args: Record<string, unknown> } | null {
	const iface = createInterface(abi);
	
	try {
		const parsed = iface.parseLog(log);
		if (!parsed) return null;
		
		const args: Record<string, unknown> = {};
		const fragment = parsed.fragment;
		
		fragment.inputs.forEach((input, index) => {
			args[input.name || `arg${index}`] = parsed.args[index];
		});
		
		return {
			name: parsed.name,
			args,
		};
	} catch {
		return null;
	}
}

/**
 * Get function fragments from ABI
 */
export function getFunctionFragments(abi: string | string[] | object[]): FunctionFragment[] {
	const iface = createInterface(abi);
	const fragments: FunctionFragment[] = [];
	
	iface.forEachFunction((func) => {
		fragments.push(func);
	});
	
	return fragments;
}

/**
 * Get event fragments from ABI
 */
export function getEventFragments(abi: string | string[] | object[]): Fragment[] {
	const iface = createInterface(abi);
	const fragments: Fragment[] = [];
	
	iface.forEachEvent((event) => {
		fragments.push(event);
	});
	
	return fragments;
}

/**
 * Check if function is view/pure (read-only)
 */
export function isReadOnlyFunction(functionFragment: FunctionFragment): boolean {
	return functionFragment.stateMutability === 'view' || functionFragment.stateMutability === 'pure';
}

/**
 * Format function signature for display
 */
export function formatFunctionSignature(functionFragment: FunctionFragment): string {
	const inputs = functionFragment.inputs.map(i => `${i.type} ${i.name}`).join(', ');
	const outputs = functionFragment.outputs?.map(o => o.type).join(', ') || '';
	return `${functionFragment.name}(${inputs})${outputs ? ` returns (${outputs})` : ''}`;
}
