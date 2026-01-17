/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Provider Transport Layer
 * Handles connections to Polygon RPC nodes
 */

import { JsonRpcProvider, Wallet } from 'ethers';
import type { ICredentialDataDecryptedObject } from 'n8n-workflow';
import { NETWORKS, getRpcUrl } from '../constants/networks';

export interface ProviderConnection {
	provider: JsonRpcProvider;
	wallet?: Wallet;
	network: string;
	chainId: number;
}

/**
 * Create a provider connection from credentials
 */
export function createProvider(credentials: ICredentialDataDecryptedObject): ProviderConnection {
	const network = credentials.network as string || 'mainnet';
	const rpcProvider = credentials.rpcProvider as string || 'public';
	const apiKey = credentials.apiKey as string || '';
	const customRpcUrl = credentials.customRpcUrl as string || '';
	const quicknodeEndpoint = credentials.quicknodeEndpoint as string || '';
	const privateKey = credentials.privateKey as string || '';
	
	let rpcUrl: string;
	
	if (network === 'custom') {
		rpcUrl = customRpcUrl;
	} else if (rpcProvider === 'quicknode' && quicknodeEndpoint) {
		// QuickNode URLs follow a specific pattern
		const networkSlug = network === 'mainnet' ? 'polygon' : network;
		rpcUrl = `https://${quicknodeEndpoint}.${networkSlug}.quiknode.pro/${apiKey}/`;
	} else {
		rpcUrl = getRpcUrl(network, rpcProvider, apiKey);
	}
	
	if (!rpcUrl) {
		throw new Error('No RPC URL configured. Please check your credentials.');
	}
	
	const networkConfig = network === 'custom' ? null : NETWORKS[network];
	const chainId = networkConfig?.chainId || (credentials.chainId as number) || 137;
	
	const provider = new JsonRpcProvider(rpcUrl, chainId);
	
	let wallet: Wallet | undefined;
	if (privateKey) {
		wallet = new Wallet(privateKey, provider);
	}
	
	return {
		provider,
		wallet,
		network,
		chainId,
	};
}

/**
 * Get provider from credentials with caching disabled (stateless)
 */
export async function getProvider(credentials: ICredentialDataDecryptedObject): Promise<ProviderConnection> {
	const connection = createProvider(credentials);
	
	// Verify connection by getting chain ID
	try {
		const network = await connection.provider.getNetwork();
		if (connection.chainId && Number(network.chainId) !== connection.chainId) {
			console.warn(`Chain ID mismatch: expected ${connection.chainId}, got ${network.chainId}`);
		}
	} catch (error) {
		throw new Error(`Failed to connect to RPC: ${(error as Error).message}`);
	}
	
	return connection;
}

/**
 * Get a signer (wallet) from credentials
 */
export function getSigner(credentials: ICredentialDataDecryptedObject): Wallet {
	const connection = createProvider(credentials);
	
	if (!connection.wallet) {
		throw new Error('Private key is required for this operation. Please add a private key to your credentials.');
	}
	
	return connection.wallet;
}

/**
 * Check if credentials have a private key for signing
 */
export function hasSigner(credentials: ICredentialDataDecryptedObject): boolean {
	return Boolean(credentials.privateKey);
}
