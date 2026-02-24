import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PolygonApi implements ICredentialType {
	name = 'polygonApi';
	displayName = 'Polygon API';
	documentationUrl = 'https://docs.polygon.technology/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Provider',
			name: 'provider',
			type: 'options',
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
					name: 'PolygonScan',
					value: 'polygonscan',
				},
				{
					name: 'Moralis',
					value: 'moralis',
				},
				{
					name: 'Custom',
					value: 'custom',
				},
			],
			default: 'alchemy',
			required: true,
			description: 'Choose your Polygon API provider',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your API key for the selected provider',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://polygon-mainnet.g.alchemy.com/v2',
			required: true,
			displayOptions: {
				show: {
					provider: [
						'custom',
					],
				},
			},
			description: 'Base URL for custom API provider',
		},
		{
			displayName: 'Network',
			name: 'network',
			type: 'options',
			options: [
				{
					name: 'Mainnet',
					value: 'mainnet',
				},
				{
					name: 'Mumbai Testnet',
					value: 'mumbai',
				},
			],
			default: 'mainnet',
			required: true,
			description: 'Polygon network to connect to',
		},
	];
}