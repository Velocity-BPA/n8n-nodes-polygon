/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Gas Estimator Utilities
 * Estimate and manage gas for transactions
 */

import type { JsonRpcProvider, TransactionRequest } from 'ethers';

export interface GasEstimate {
	gasLimit: bigint;
	gasPrice: bigint;
	maxFeePerGas?: bigint;
	maxPriorityFeePerGas?: bigint;
	estimatedCost: bigint;
	estimatedCostMatic: string;
}

export interface GasPrices {
	slow: bigint;
	standard: bigint;
	fast: bigint;
	instant: bigint;
}

/**
 * Get current gas prices
 */
export async function getGasPrices(provider: JsonRpcProvider): Promise<GasPrices> {
	const feeData = await provider.getFeeData();
	const gasPrice = feeData.gasPrice || BigInt(30000000000); // 30 gwei default
	
	return {
		slow: gasPrice * BigInt(80) / BigInt(100),
		standard: gasPrice,
		fast: gasPrice * BigInt(120) / BigInt(100),
		instant: gasPrice * BigInt(150) / BigInt(100),
	};
}

/**
 * Estimate gas for a transaction
 */
export async function estimateGas(
	provider: JsonRpcProvider,
	transaction: TransactionRequest
): Promise<GasEstimate> {
	const [gasLimit, feeData] = await Promise.all([
		provider.estimateGas(transaction),
		provider.getFeeData(),
	]);
	
	// Add 20% buffer to gas limit
	const bufferedGasLimit = gasLimit * BigInt(120) / BigInt(100);
	
	const gasPrice = feeData.gasPrice || BigInt(30000000000);
	const maxFeePerGas = feeData.maxFeePerGas || undefined;
	const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas || undefined;
	
	const estimatedCost = bufferedGasLimit * gasPrice;
	const estimatedCostMatic = (Number(estimatedCost) / 1e18).toFixed(6);
	
	return {
		gasLimit: bufferedGasLimit,
		gasPrice,
		maxFeePerGas,
		maxPriorityFeePerGas,
		estimatedCost,
		estimatedCostMatic,
	};
}

/**
 * Get EIP-1559 fee data
 */
export async function getEip1559FeeData(provider: JsonRpcProvider): Promise<{
	maxFeePerGas: bigint;
	maxPriorityFeePerGas: bigint;
	baseFee: bigint;
}> {
	const feeData = await provider.getFeeData();
	const block = await provider.getBlock('latest');
	
	const baseFee = block?.baseFeePerGas || BigInt(0);
	const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas || BigInt(30000000000);
	const maxFeePerGas = feeData.maxFeePerGas || (baseFee * BigInt(2) + maxPriorityFeePerGas);
	
	return {
		maxFeePerGas,
		maxPriorityFeePerGas,
		baseFee,
	};
}

/**
 * Calculate gas limit for common operations
 */
export const GAS_LIMITS = {
	TRANSFER_NATIVE: BigInt(21000),
	TRANSFER_ERC20: BigInt(65000),
	TRANSFER_ERC721: BigInt(100000),
	TRANSFER_ERC1155: BigInt(100000),
	APPROVE_ERC20: BigInt(50000),
	SWAP: BigInt(200000),
	ADD_LIQUIDITY: BigInt(250000),
	REMOVE_LIQUIDITY: BigInt(250000),
	CONTRACT_DEPLOY: BigInt(1000000),
};

/**
 * Format gas estimate for display
 */
export function formatGasEstimate(estimate: GasEstimate): Record<string, string> {
	return {
		gasLimit: estimate.gasLimit.toString(),
		gasPrice: `${Number(estimate.gasPrice) / 1e9} Gwei`,
		maxFeePerGas: estimate.maxFeePerGas ? `${Number(estimate.maxFeePerGas) / 1e9} Gwei` : 'N/A',
		maxPriorityFeePerGas: estimate.maxPriorityFeePerGas ? `${Number(estimate.maxPriorityFeePerGas) / 1e9} Gwei` : 'N/A',
		estimatedCost: `${estimate.estimatedCostMatic} MATIC`,
	};
}
