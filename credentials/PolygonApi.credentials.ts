import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PolygonApi implements ICredentialType {
	name = 'polygonApi';
	displayName = 'Polygon API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API key for Polygon RPC provider',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://polygon-rpc.com',
			description: 'Base URL for the Polygon RPC endpoint',
		},
	];
}