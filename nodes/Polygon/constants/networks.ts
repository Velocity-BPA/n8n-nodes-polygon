/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Polygon Network Configurations
 */

export interface NetworkConfig {
	name: string;
	chainId: number;
	currency: {
		name: string;
		symbol: string;
		decimals: number;
	};
	rpcUrls: {
		public: string;
		alchemy?: string;
		infura?: string;
	};
	explorerUrl: string;
	explorerApiUrl: string;
	isTestnet: boolean;
	multicallAddress: string;
}

export const NETWORKS: Record<string, NetworkConfig> = {
	mainnet: {
		name: 'Polygon Mainnet',
		chainId: 137,
		currency: {
			name: 'MATIC',
			symbol: 'MATIC',
			decimals: 18,
		},
		rpcUrls: {
			public: 'https://polygon-rpc.com',
			alchemy: 'https://polygon-mainnet.g.alchemy.com/v2/',
			infura: 'https://polygon-mainnet.infura.io/v3/',
		},
		explorerUrl: 'https://polygonscan.com',
		explorerApiUrl: 'https://api.polygonscan.com/api',
		isTestnet: false,
		multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
	},
	amoy: {
		name: 'Polygon Amoy Testnet',
		chainId: 80002,
		currency: {
			name: 'MATIC',
			symbol: 'MATIC',
			decimals: 18,
		},
		rpcUrls: {
			public: 'https://rpc-amoy.polygon.technology',
			alchemy: 'https://polygon-amoy.g.alchemy.com/v2/',
			infura: 'https://polygon-amoy.infura.io/v3/',
		},
		explorerUrl: 'https://amoy.polygonscan.com',
		explorerApiUrl: 'https://api-amoy.polygonscan.com/api',
		isTestnet: true,
		multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
	},
	zkevm: {
		name: 'Polygon zkEVM Mainnet',
		chainId: 1101,
		currency: {
			name: 'Ethereum',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			public: 'https://zkevm-rpc.com',
			alchemy: 'https://polygonzkevm-mainnet.g.alchemy.com/v2/',
		},
		explorerUrl: 'https://zkevm.polygonscan.com',
		explorerApiUrl: 'https://api-zkevm.polygonscan.com/api',
		isTestnet: false,
		multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
	},
	cardona: {
		name: 'Polygon zkEVM Cardona Testnet',
		chainId: 2442,
		currency: {
			name: 'Ethereum',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			public: 'https://rpc.cardona.zkevm-rpc.com',
		},
		explorerUrl: 'https://cardona-zkevm.polygonscan.com',
		explorerApiUrl: 'https://api-cardona-zkevm.polygonscan.com/api',
		isTestnet: true,
		multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
	},
};

export function getNetworkConfig(network: string): NetworkConfig {
	const config = NETWORKS[network];
	if (!config) {
		throw new Error(`Unknown network: ${network}`);
	}
	return config;
}

export function getChainId(network: string): number {
	return getNetworkConfig(network).chainId;
}

export function getExplorerApiUrl(network: string): string {
	return getNetworkConfig(network).explorerApiUrl;
}

export function getRpcUrl(network: string, provider: string, apiKey?: string): string {
	const config = getNetworkConfig(network);
	
	if (provider === 'public') {
		return config.rpcUrls.public;
	}
	
	if (provider === 'alchemy' && config.rpcUrls.alchemy) {
		return `${config.rpcUrls.alchemy}${apiKey || ''}`;
	}
	
	if (provider === 'infura' && config.rpcUrls.infura) {
		return `${config.rpcUrls.infura}${apiKey || ''}`;
	}
	
	return config.rpcUrls.public;
}
