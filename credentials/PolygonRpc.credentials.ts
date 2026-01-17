/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PolygonRpc implements ICredentialType {
	name = 'polygonRpc';
	displayName = 'Polygon RPC';
	documentationUrl = 'https://docs.polygon.technology/';
	properties: INodeProperties[] = [
		{
			displayName: 'Network',
			name: 'network',
			type: 'options',
			default: 'mainnet',
			options: [
				{
					name: 'Polygon Mainnet (PoS)',
					value: 'mainnet',
				},
				{
					name: 'Polygon Amoy Testnet',
					value: 'amoy',
				},
				{
					name: 'Polygon zkEVM Mainnet',
					value: 'zkevm',
				},
				{
					name: 'Polygon zkEVM Cardona Testnet',
					value: 'cardona',
				},
				{
					name: 'Custom RPC',
					value: 'custom',
				},
			],
			description: 'The Polygon network to connect to',
		},
		{
			displayName: 'RPC Provider',
			name: 'rpcProvider',
			type: 'options',
			default: 'alchemy',
			options: [
				{
					name: 'Alchemy',
					value: 'alchemy',
				},
				{
					name: 'Infura',
					value: 'infura',
				},
				{
					name: 'QuickNode',
					value: 'quicknode',
				},
				{
					name: 'Public RPC (No API Key)',
					value: 'public',
				},
				{
					name: 'Custom URL',
					value: 'custom',
				},
			],
			displayOptions: {
				hide: {
					network: ['custom'],
				},
			},
			description: 'The RPC provider to use',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			displayOptions: {
				show: {
					rpcProvider: ['alchemy', 'infura', 'quicknode'],
				},
				hide: {
					network: ['custom'],
				},
			},
			description: 'API key for your RPC provider',
		},
		{
			displayName: 'Custom RPC URL',
			name: 'customRpcUrl',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					network: ['custom'],
				},
			},
			placeholder: 'https://your-rpc-endpoint.com',
			description: 'Custom RPC endpoint URL',
		},
		{
			displayName: 'QuickNode Endpoint',
			name: 'quicknodeEndpoint',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					rpcProvider: ['quicknode'],
				},
				hide: {
					network: ['custom'],
				},
			},
			placeholder: 'your-endpoint-name',
			description: 'Your QuickNode endpoint name (without domain)',
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Private key for signing transactions (optional, only needed for write operations)',
		},
		{
			displayName: 'Chain ID',
			name: 'chainId',
			type: 'number',
			default: 137,
			description: 'The chain ID (137=Mainnet, 80002=Amoy, 1101=zkEVM, 2442=Cardona)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.customRpcUrl || "https://polygon-rpc.com"}}',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: '2.0',
				method: 'eth_chainId',
				params: [],
				id: 1,
			}),
		},
	};
}
