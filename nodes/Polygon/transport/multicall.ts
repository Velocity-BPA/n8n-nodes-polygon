/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Multicall Transport Layer
 * Batch multiple contract calls into a single RPC request
 */

import { Contract, Interface } from 'ethers';
import type { Provider } from 'ethers';
import { MULTICALL3_ABI } from '../constants/abis';
import { NETWORKS } from '../constants/networks';

export interface MulticallRequest {
	target: string;
	callData: string;
	allowFailure?: boolean;
}

export interface MulticallResult {
	success: boolean;
	returnData: string;
}

/**
 * Multicall3 client for batching contract calls
 */
export class MulticallClient {
	private contract: Contract;
	private multicallAddress: string;
	
	constructor(provider: Provider, network: string) {
		const networkConfig = NETWORKS[network];
		if (!networkConfig) {
			throw new Error(`Unknown network: ${network}`);
		}
		
		this.multicallAddress = networkConfig.multicallAddress;
		this.contract = new Contract(this.multicallAddress, MULTICALL3_ABI, provider);
	}
	
	/**
	 * Execute a batch of calls
	 */
	async aggregate3(calls: MulticallRequest[]): Promise<MulticallResult[]> {
		const formattedCalls = calls.map(call => ({
			target: call.target,
			allowFailure: call.allowFailure ?? true,
			callData: call.callData,
		}));
		
		const results = await this.contract.aggregate3(formattedCalls);
		
		return results.map((result: { success: boolean; returnData: string }) => ({
			success: result.success,
			returnData: result.returnData,
		}));
	}
	
	/**
	 * Execute a simple aggregate (all must succeed)
	 */
	async aggregate(calls: MulticallRequest[]): Promise<{ blockNumber: bigint; returnData: string[] }> {
		const formattedCalls = calls.map(call => ({
			target: call.target,
			callData: call.callData,
		}));
		
		const [blockNumber, returnData] = await this.contract.aggregate(formattedCalls);
		
		return {
			blockNumber,
			returnData,
		};
	}
	
	/**
	 * Get ETH/MATIC balance for an address
	 */
	async getEthBalance(address: string): Promise<bigint> {
		return await this.contract.getEthBalance(address);
	}
	
	/**
	 * Get current block number
	 */
	async getBlockNumber(): Promise<bigint> {
		return await this.contract.getBlockNumber();
	}
	
	/**
	 * Get current chain ID
	 */
	async getChainId(): Promise<bigint> {
		return await this.contract.getChainId();
	}
	
	/**
	 * Get block hash for a block number
	 */
	async getBlockHash(blockNumber: number): Promise<string> {
		return await this.contract.getBlockHash(blockNumber);
	}
	
	/**
	 * Get current block timestamp
	 */
	async getCurrentBlockTimestamp(): Promise<bigint> {
		return await this.contract.getCurrentBlockTimestamp();
	}
	
	/**
	 * Get base fee (EIP-1559)
	 */
	async getBasefee(): Promise<bigint> {
		return await this.contract.getBasefee();
	}
}

/**
 * Helper to encode a function call for multicall
 */
export function encodeCall(contractInterface: Interface, functionName: string, args: unknown[]): string {
	return contractInterface.encodeFunctionData(functionName, args);
}

/**
 * Helper to decode a function result from multicall
 */
export function decodeResult(contractInterface: Interface, functionName: string, data: string): unknown {
	return contractInterface.decodeFunctionResult(functionName, data);
}

/**
 * Batch multiple ERC20 balance checks
 */
export async function batchGetBalances(
	multicall: MulticallClient,
	tokenAddresses: string[],
	walletAddress: string
): Promise<Map<string, bigint>> {
	const erc20Interface = new Interface(['function balanceOf(address) view returns (uint256)']);
	
	const calls: MulticallRequest[] = tokenAddresses.map(token => ({
		target: token,
		callData: encodeCall(erc20Interface, 'balanceOf', [walletAddress]),
		allowFailure: true,
	}));
	
	const results = await multicall.aggregate3(calls);
	
	const balances = new Map<string, bigint>();
	
	for (let i = 0; i < results.length; i++) {
		if (results[i].success) {
			try {
				const decoded = decodeResult(erc20Interface, 'balanceOf', results[i].returnData);
				balances.set(tokenAddresses[i], decoded as bigint);
			} catch {
				balances.set(tokenAddresses[i], BigInt(0));
			}
		} else {
			balances.set(tokenAddresses[i], BigInt(0));
		}
	}
	
	return balances;
}
