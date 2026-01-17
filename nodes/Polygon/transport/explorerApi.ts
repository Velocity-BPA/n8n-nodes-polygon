/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Explorer API Transport Layer
 * Handles requests to PolygonScan and zkEVM Explorer APIs
 */

import axios, { AxiosInstance } from 'axios';
import type { ICredentialDataDecryptedObject } from 'n8n-workflow';
import { getExplorerApiUrl } from '../constants/networks';

export interface ExplorerApiResponse<T = unknown> {
	status: string;
	message: string;
	result: T;
}

export interface ExplorerApiClient {
	client: AxiosInstance;
	apiKey: string;
	network: string;
}

/**
 * Create an explorer API client
 */
export function createExplorerClient(credentials: ICredentialDataDecryptedObject): ExplorerApiClient {
	const apiKey = credentials.apiKey as string;
	const network = credentials.network as string || 'mainnet';
	
	if (!apiKey) {
		throw new Error('PolygonScan API key is required');
	}
	
	const baseURL = getExplorerApiUrl(network);
	
	const client = axios.create({
		baseURL,
		timeout: 30000,
		params: {
			apikey: apiKey,
		},
	});
	
	return {
		client,
		apiKey,
		network,
	};
}

/**
 * Get account balance
 */
export async function getAccountBalance(
	client: ExplorerApiClient,
	address: string
): Promise<string> {
	const response = await client.client.get<ExplorerApiResponse<string>>('', {
		params: {
			module: 'account',
			action: 'balance',
			address,
			tag: 'latest',
		},
	});
	
	if (response.data.status !== '1') {
		throw new Error(`Explorer API error: ${response.data.message}`);
	}
	
	return response.data.result;
}

/**
 * Get transaction list for an address
 */
export async function getTransactionList(
	client: ExplorerApiClient,
	address: string,
	options: {
		startBlock?: number;
		endBlock?: number;
		page?: number;
		offset?: number;
		sort?: 'asc' | 'desc';
	} = {}
): Promise<unknown[]> {
	const response = await client.client.get<ExplorerApiResponse<unknown[]>>('', {
		params: {
			module: 'account',
			action: 'txlist',
			address,
			startblock: options.startBlock || 0,
			endblock: options.endBlock || 99999999,
			page: options.page || 1,
			offset: options.offset || 10,
			sort: options.sort || 'desc',
		},
	});
	
	if (response.data.status !== '1' && response.data.message !== 'No transactions found') {
		throw new Error(`Explorer API error: ${response.data.message}`);
	}
	
	return Array.isArray(response.data.result) ? response.data.result : [];
}

/**
 * Get token transfers for an address
 */
export async function getTokenTransfers(
	client: ExplorerApiClient,
	address: string,
	options: {
		contractAddress?: string;
		startBlock?: number;
		endBlock?: number;
		page?: number;
		offset?: number;
		sort?: 'asc' | 'desc';
	} = {}
): Promise<unknown[]> {
	const params: Record<string, unknown> = {
		module: 'account',
		action: 'tokentx',
		address,
		startblock: options.startBlock || 0,
		endblock: options.endBlock || 99999999,
		page: options.page || 1,
		offset: options.offset || 10,
		sort: options.sort || 'desc',
	};
	
	if (options.contractAddress) {
		params.contractaddress = options.contractAddress;
	}
	
	const response = await client.client.get<ExplorerApiResponse<unknown[]>>('', { params });
	
	if (response.data.status !== '1' && response.data.message !== 'No transactions found') {
		throw new Error(`Explorer API error: ${response.data.message}`);
	}
	
	return Array.isArray(response.data.result) ? response.data.result : [];
}

/**
 * Get NFT transfers for an address
 */
export async function getNftTransfers(
	client: ExplorerApiClient,
	address: string,
	options: {
		contractAddress?: string;
		startBlock?: number;
		endBlock?: number;
		page?: number;
		offset?: number;
		sort?: 'asc' | 'desc';
	} = {}
): Promise<unknown[]> {
	const params: Record<string, unknown> = {
		module: 'account',
		action: 'tokennfttx',
		address,
		startblock: options.startBlock || 0,
		endblock: options.endBlock || 99999999,
		page: options.page || 1,
		offset: options.offset || 10,
		sort: options.sort || 'desc',
	};
	
	if (options.contractAddress) {
		params.contractaddress = options.contractAddress;
	}
	
	const response = await client.client.get<ExplorerApiResponse<unknown[]>>('', { params });
	
	if (response.data.status !== '1' && response.data.message !== 'No transactions found') {
		throw new Error(`Explorer API error: ${response.data.message}`);
	}
	
	return Array.isArray(response.data.result) ? response.data.result : [];
}

/**
 * Get contract ABI
 */
export async function getContractAbi(
	client: ExplorerApiClient,
	address: string
): Promise<string> {
	const response = await client.client.get<ExplorerApiResponse<string>>('', {
		params: {
			module: 'contract',
			action: 'getabi',
			address,
		},
	});
	
	if (response.data.status !== '1') {
		throw new Error(`Explorer API error: ${response.data.message}`);
	}
	
	return response.data.result;
}

/**
 * Get contract source code
 */
export async function getContractSource(
	client: ExplorerApiClient,
	address: string
): Promise<unknown[]> {
	const response = await client.client.get<ExplorerApiResponse<unknown[]>>('', {
		params: {
			module: 'contract',
			action: 'getsourcecode',
			address,
		},
	});
	
	if (response.data.status !== '1') {
		throw new Error(`Explorer API error: ${response.data.message}`);
	}
	
	return response.data.result;
}

/**
 * Get gas oracle data
 */
export async function getGasOracle(client: ExplorerApiClient): Promise<{
	SafeGasPrice: string;
	ProposeGasPrice: string;
	FastGasPrice: string;
}> {
	const response = await client.client.get<ExplorerApiResponse<{
		SafeGasPrice: string;
		ProposeGasPrice: string;
		FastGasPrice: string;
	}>>('', {
		params: {
			module: 'gastracker',
			action: 'gasoracle',
		},
	});
	
	if (response.data.status !== '1') {
		throw new Error(`Explorer API error: ${response.data.message}`);
	}
	
	return response.data.result;
}
