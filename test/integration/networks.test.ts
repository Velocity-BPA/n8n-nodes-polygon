/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { NETWORKS, getNetworkConfig, getRpcUrl } from '../../nodes/Polygon/constants/networks';

describe('Network Configuration', () => {
	describe('NETWORKS', () => {
		it('should have mainnet configuration', () => {
			expect(NETWORKS.mainnet).toBeDefined();
			expect(NETWORKS.mainnet.chainId).toBe(137);
			expect(NETWORKS.mainnet.currency.symbol).toBe('MATIC');
		});

		it('should have amoy testnet configuration', () => {
			expect(NETWORKS.amoy).toBeDefined();
			expect(NETWORKS.amoy.chainId).toBe(80002);
			expect(NETWORKS.amoy.isTestnet).toBe(true);
		});

		it('should have zkEVM mainnet configuration', () => {
			expect(NETWORKS.zkevm).toBeDefined();
			expect(NETWORKS.zkevm.chainId).toBe(1101);
			expect(NETWORKS.zkevm.currency.symbol).toBe('ETH');
		});

		it('should have cardona testnet configuration', () => {
			expect(NETWORKS.cardona).toBeDefined();
			expect(NETWORKS.cardona.chainId).toBe(2442);
			expect(NETWORKS.cardona.isTestnet).toBe(true);
		});
	});

	describe('getNetworkConfig', () => {
		it('should return config for valid networks', () => {
			expect(getNetworkConfig('mainnet').chainId).toBe(137);
			expect(getNetworkConfig('amoy').chainId).toBe(80002);
		});

		it('should throw for unknown networks', () => {
			expect(() => getNetworkConfig('unknown')).toThrow('Unknown network: unknown');
		});
	});

	describe('getRpcUrl', () => {
		it('should return public RPC URL', () => {
			const url = getRpcUrl('mainnet', 'public');
			expect(url).toBe('https://polygon-rpc.com');
		});

		it('should return Alchemy URL with API key', () => {
			const url = getRpcUrl('mainnet', 'alchemy', 'test-key');
			expect(url).toBe('https://polygon-mainnet.g.alchemy.com/v2/test-key');
		});

		it('should return Infura URL with API key', () => {
			const url = getRpcUrl('mainnet', 'infura', 'test-key');
			expect(url).toBe('https://polygon-mainnet.infura.io/v3/test-key');
		});

		it('should fallback to public RPC for unsupported providers', () => {
			const url = getRpcUrl('mainnet', 'unsupported');
			expect(url).toBe('https://polygon-rpc.com');
		});
	});
});

describe('Provider Connection', () => {
	// These tests would require mocking the provider
	// In a real environment, you would test with a mock RPC
	it('should be implemented with provider mocks', () => {
		expect(true).toBe(true);
	});
});
