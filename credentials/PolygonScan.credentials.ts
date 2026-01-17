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

export class PolygonScan implements ICredentialType {
	name = 'polygonScan';
	displayName = 'PolygonScan API';
	documentationUrl = 'https://docs.polygonscan.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your PolygonScan API key',
		},
		{
			displayName: 'Network',
			name: 'network',
			type: 'options',
			default: 'mainnet',
			options: [
				{
					name: 'Polygon Mainnet',
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
			],
			description: 'The network for the explorer API',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				apikey: '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://api.polygonscan.com',
			url: '/api',
			qs: {
				module: 'account',
				action: 'balance',
				address: '0x0000000000000000000000000000000000000000',
				apikey: '={{$credentials.apiKey}}',
			},
		},
	};
}
