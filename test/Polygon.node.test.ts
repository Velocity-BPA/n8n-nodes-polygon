/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Polygon } from '../nodes/Polygon/Polygon.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Polygon Node', () => {
  let node: Polygon;

  beforeAll(() => {
    node = new Polygon();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Polygon');
      expect(node.description.name).toBe('polygon');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Block Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://polygon-rpc.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getByNumber operation', () => {
		it('should get block by number successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getByNumber')
				.mockReturnValueOnce('latest')
				.mockReturnValueOnce(false);

			const mockResponse = {
				jsonrpc: '2.0',
				id: 1,
				result: {
					number: '0x1b4',
					hash: '0x0e4cc861b0ec558c1bcf8e8d9b7b4c7c8a8f9e9f',
					transactions: [],
				},
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://polygon-rpc.com',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer test-key',
				},
				json: true,
				body: {
					jsonrpc: '2.0',
					id: 1,
					method: 'eth_getBlockByNumber',
					params: ['latest', false],
				},
			});
		});

		it('should handle JSON-RPC error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getByNumber')
				.mockReturnValueOnce('0x123')
				.mockReturnValueOnce(true);

			const mockErrorResponse = {
				jsonrpc: '2.0',
				id: 1,
				error: {
					code: -32602,
					message: 'Invalid params',
				},
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

			await expect(
				executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }])
			).rejects.toThrow('JSON-RPC Error: Invalid params (Code: -32602)');
		});
	});

	describe('getByHash operation', () => {
		it('should get block by hash successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getByHash')
				.mockReturnValueOnce('0x1234567890abcdef')
				.mockReturnValueOnce(true);

			const mockResponse = {
				jsonrpc: '2.0',
				id: 1,
				result: {
					hash: '0x1234567890abcdef',
					number: '0x1b4',
					transactions: [{}],
				},
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('getLatestNumber operation', () => {
		it('should get latest block number successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getLatestNumber');

			const mockResponse = {
				jsonrpc: '2.0',
				id: 1,
				result: '0x1b4',
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					body: expect.objectContaining({
						method: 'eth_blockNumber',
						params: [],
					}),
				})
			);
		});
	});

	describe('getTxCountByNumber operation', () => {
		it('should get transaction count by block number successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTxCountByNumber')
				.mockReturnValueOnce('latest');

			const mockResponse = {
				jsonrpc: '2.0',
				id: 1,
				result: '0x5',
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('getTxCountByHash operation', () => {
		it('should get transaction count by block hash successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTxCountByHash')
				.mockReturnValueOnce('0x1234567890abcdef');

			const mockResponse = {
				jsonrpc: '2.0',
				id: 1,
				result: '0x3',
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('error handling', () => {
		it('should continue on fail when enabled', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getLatestNumber');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

			const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({ error: 'Network error' });
		});

		it('should throw error when continue on fail is disabled', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getLatestNumber');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

			await expect(
				executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }])
			).rejects.toThrow('Network error');
		});
	});
});

describe('Transaction Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({ 
				apiKey: 'test-key', 
				baseUrl: 'https://polygon-rpc.com' 
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: { 
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn() 
			},
		};
	});

	it('should get transaction by hash successfully', async () => {
		const mockResponse = {
			jsonrpc: '2.0',
			id: 1,
			result: {
				hash: '0x123',
				from: '0xabc',
				to: '0xdef'
			}
		};

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getTransactionByHash')
			.mockReturnValueOnce('0x123456');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

		const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
	});

	it('should handle transaction by hash error', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getTransactionByHash')
			.mockReturnValueOnce('invalid-hash');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid transaction hash'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('Invalid transaction hash');
	});

	it('should get transaction receipt successfully', async () => {
		const mockResponse = {
			jsonrpc: '2.0',
			id: 1,
			result: {
				transactionHash: '0x123',
				status: '0x1',
				gasUsed: '0x5208'
			}
		};

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getTransactionReceipt')
			.mockReturnValueOnce('0x123456');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

		const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
	});

	it('should send raw transaction successfully', async () => {
		const mockResponse = {
			jsonrpc: '2.0',
			id: 1,
			result: '0x123456789'
		};

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('sendRawTransaction')
			.mockReturnValueOnce('0xsignedtransactiondata');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

		const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
	});

	it('should get transaction count successfully', async () => {
		const mockResponse = {
			jsonrpc: '2.0',
			id: 1,
			result: '0x1a'
		};

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getTransactionCount')
			.mockReturnValueOnce('0x123456789')
			.mockReturnValueOnce('latest');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

		const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
	});

	it('should throw error for unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

		await expect(executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]))
			.rejects
			.toThrow('Unknown operation: unknownOperation');
	});
});

describe('Account Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://polygon-rpc.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getBalance operation', () => {
    it('should get account balance successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBalance')
        .mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D4c0746E47516b2C')
        .mockReturnValueOnce('latest');

      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: '0x1bc16d674ec80000'
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle getBalance errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBalance')
        .mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D4c0746E47516b2C')
        .mockReturnValueOnce('latest');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getTransactionCount operation', () => {
    it('should get transaction count successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTransactionCount')
        .mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D4c0746E47516b2C')
        .mockReturnValueOnce('latest');

      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: '0x1a'
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getCode operation', () => {
    it('should get contract code successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCode')
        .mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D4c0746E47516b2C')
        .mockReturnValueOnce('latest');

      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: '0x608060405234801561001057600080fd5b50...'
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getStorageAt operation', () => {
    it('should get storage value successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getStorageAt')
        .mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D4c0746E47516b2C')
        .mockReturnValueOnce('0x0')
        .mockReturnValueOnce('latest');

      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: '0x0000000000000000000000000000000000000000000000000000000000000000'
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });
});

describe('SmartContract Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://polygon-rpc.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('callMethod operation', () => {
		it('should successfully call contract method', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('callMethod')
				.mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D33AA5DD')
				.mockReturnValueOnce('0xa9059cbb000000000000000000000000')
				.mockReturnValueOnce('0x123...')
				.mockReturnValueOnce('0x5208')
				.mockReturnValueOnce('0x9502f9000')
				.mockReturnValueOnce('0x0')
				.mockReturnValueOnce('latest');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				jsonrpc: '2.0',
				id: 1,
				result: '0x0000000000000000000000000000000000000000000000000000000000000001',
			});

			const result = await executeSmartContractOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.result).toBe('0x0000000000000000000000000000000000000000000000000000000000000001');
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://polygon-rpc.com',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer test-key',
				},
				body: {
					jsonrpc: '2.0',
					method: 'eth_call',
					params: [{
						to: '0x742d35Cc6634C0532925a3b8D33AA5DD',
						data: '0xa9059cbb000000000000000000000000',
						from: '0x123...',
						gas: '0x5208',
						gasPrice: '0x9502f9000',
						value: '0x0',
					}, 'latest'],
					id: 1,
				},
				json: true,
			});
		});

		it('should handle RPC errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('callMethod');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				jsonrpc: '2.0',
				id: 1,
				error: { code: -32000, message: 'execution reverted' },
			});

			await expect(executeSmartContractOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			)).rejects.toThrow('Polygon RPC Error: execution reverted');
		});
	});

	describe('estimateGas operation', () => {
		it('should successfully estimate gas', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('estimateGas')
				.mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D33AA5DD')
				.mockReturnValueOnce('0xa9059cbb000000000000000000000000')
				.mockReturnValueOnce('0x123...')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('0x0');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				jsonrpc: '2.0',
				id: 1,
				result: '0x5208',
			});

			const result = await executeSmartContractOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.result).toBe('0x5208');
		});
	});

	describe('getCode operation', () => {
		it('should successfully get contract code', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getCode')
				.mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D33AA5DD')
				.mockReturnValueOnce('latest');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				jsonrpc: '2.0',
				id: 1,
				result: '0x608060405234801561001057600080fd5b50...',
			});

			const result = await executeSmartContractOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.result).toBe('0x608060405234801561001057600080fd5b50...');
		});
	});

	describe('getLogs operation', () => {
		it('should successfully get logs', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getLogs')
				.mockReturnValueOnce('0x1')
				.mockReturnValueOnce('latest')
				.mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D33AA5DD')
				.mockReturnValueOnce('["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]')
				.mockReturnValueOnce('');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				jsonrpc: '2.0',
				id: 1,
				result: [
					{
						address: '0x742d35Cc6634C0532925a3b8D33AA5DD',
						topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
						data: '0x000000000000000000000000000000000000000000000000000000000000000a',
						blockNumber: '0x1b4',
						transactionHash: '0x...',
						logIndex: '0x0',
					}
				],
			});

			const result = await executeSmartContractOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(Array.isArray(result[0].json.result)).toBe(true);
			expect(result[0].json.result).toHaveLength(1);
		});

		it('should handle invalid topics JSON', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getLogs')
				.mockReturnValueOnce('0x1')
				.mockReturnValueOnce('latest')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('invalid json')
				.mockReturnValueOnce('');

			await expect(executeSmartContractOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			)).rejects.toThrow('Invalid topics format');
		});
	});

	it('should handle unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

		await expect(executeSmartContractOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		)).rejects.toThrow('Unknown operation: unknownOperation');
	});

	it('should continue on fail when enabled', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('callMethod');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

		const result = await executeSmartContractOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('Network error');
	});
});

describe('Token Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://polygon-rpc.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should get token balance successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBalance')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
      .mockReturnValueOnce('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')
      .mockReturnValueOnce('latest');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: '0x1bc16d674ec80000',
      }),
    );

    const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.balance).toBe('0x1bc16d674ec80000');
    expect(result[0].json.contractAddress).toBe('0x1234567890123456789012345678901234567890');
  });

  test('should handle get balance errors', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBalance')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
      .mockReturnValueOnce('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')
      .mockReturnValueOnce('latest');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Network error');
  });

  test('should get token metadata successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getMetadata')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
      .mockReturnValueOnce('latest');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
      JSON.stringify([
        { jsonrpc: '2.0', id: 1, result: '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000045465737400000000000000000000000000000000000000000000000000000000' },
        { jsonrpc: '2.0', id: 2, result: '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003545354000000000000000000000000000000000000000000000000000000000' },
        { jsonrpc: '2.0', id: 3, result: '0x0000000000000000000000000000000000000000000000000000000000000012' },
      ]),
    );

    const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.contractAddress).toBe('0x1234567890123456789012345678901234567890');
    expect(result[0].json.decimals).toBe('0x0000000000000000000000000000000000000000000000000000000000000012');
  });

  test('should get transfer events successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTransferEvents')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
      .mockReturnValueOnce('0x1000000')
      .mockReturnValueOnce('latest')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: [
          {
            address: '0x1234567890123456789012345678901234567890',
            topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
            data: '0x1bc16d674ec80000',
          },
        ],
      }),
    );

    const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.events).toHaveLength(1);
    expect(result[0].json.contractAddress).toBe('0x1234567890123456789012345678901234567890');
  });

  test('should get allowance successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllowance')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
      .mockReturnValueOnce('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')
      .mockReturnValueOnce('0x1111111111111111111111111111111111111111')
      .mockReturnValueOnce('latest');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      }),
    );

    const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.allowance).toBe('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
    expect(result[0].json.ownerAddress).toBe('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd');
    expect(result[0].json.spenderAddress).toBe('0x1111111111111111111111111111111111111111');
  });
});

describe('Network Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://polygon-rpc.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get chain ID successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: '0x89'
    };

    mockExecuteFunctions.getNodeParameter.mockReturnValue('getChainId');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNetworkOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should get gas price successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: '0x9502f9000'
    };

    mockExecuteFunctions.getNodeParameter.mockReturnValue('getGasPrice');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNetworkOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should get fee history successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: {
        oldestBlock: '0x1234567',
        baseFeePerGas: ['0x12a05f200', '0x128dfa6a0'],
        gasUsedRatio: [0.5, 0.6],
        reward: [['0x77359400', '0x773594000', '0x7735940000']]
      }
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getFeeHistory')
      .mockReturnValueOnce(10)
      .mockReturnValueOnce('latest')
      .mockReturnValueOnce('25,50,75');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNetworkOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should get network version successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: '137'
    };

    mockExecuteFunctions.getNodeParameter.mockReturnValue('getNetworkVersion');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNetworkOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should get client version successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: 'Bor/v0.3.3-stable-8d3925bc/linux-amd64/go1.18.10'
    };

    mockExecuteFunctions.getNodeParameter.mockReturnValue('getClientVersion');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNetworkOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should handle API errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getChainId');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeNetworkOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getChainId');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);

    await expect(
      executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

    await expect(
      executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});
});
