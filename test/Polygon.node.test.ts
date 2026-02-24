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

    it('should define 7 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(7);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(7);
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
describe('Accounts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
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

  test('should get account balance successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getBalance';
        case 'address': return '0x742d35Cc6635C0532925a3b8D5C9E2c29c7b18e6';
        case 'block': return 'latest';
        default: return undefined;
      }
    });

    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: '0x1b1ae4d6e2ef500000',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://polygon-mainnet.g.alchemy.com/v2/test-api-key',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: ['0x742d35Cc6635C0532925a3b8D5C9E2c29c7b18e6', 'latest'],
        id: 1,
      }),
      json: true,
    });
  });

  test('should get transaction count successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getTransactionCount';
        case 'address': return '0x742d35Cc6635C0532925a3b8D5C9E2c29c7b18e6';
        case 'block': return 'latest';
        default: return undefined;
      }
    });

    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: '0x1a',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should get transaction list successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getTransactionList';
        case 'address': return '0x742d35Cc6635C0532925a3b8D5C9E2c29c7b18e6';
        case 'startblock': return '0';
        case 'endblock': return '99999999';
        case 'page': return 1;
        case 'offset': return 10;
        case 'sort': return 'desc';
        default: return undefined;
      }
    });

    const mockResponse = {
      status: '1',
      message: 'OK',
      result: [
        {
          hash: '0x123...',
          blockNumber: '12345',
          from: '0x742d35Cc6635C0532925a3b8D5C9E2c29c7b18e6',
          to: '0x456...',
          value: '1000000000000000000',
        },
      ],
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should get ERC20 transfers successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getErc20Transfers';
        case 'address': return '0x742d35Cc6635C0532925a3b8D5C9E2c29c7b18e6';
        case 'startblock': return '0';
        case 'endblock': return '99999999';
        case 'page': return 1;
        case 'offset': return 10;
        case 'sort': return 'desc';
        case 'contractaddress': return '';
        default: return undefined;
      }
    });

    const mockResponse = {
      status: '1',
      message: 'OK',
      result: [
        {
          hash: '0x123...',
          tokenSymbol: 'USDT',
          tokenName: 'Tether USD',
          value: '1000000',
        },
      ],
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getBalance';
        case 'address': return '0x742d35Cc6635C0532925a3b8D5C9E2c29c7b18e6';
        case 'block': return 'latest';
        default: return undefined;
      }
    });

    const mockError = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    await expect(executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
  });

  test('should continue on fail when configured', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getBalance';
        case 'address': return '0x742d35Cc6635C0532925a3b8D5C9E2c29c7b18e6';
        case 'block': return 'latest';
        default: return undefined;
      }
    });

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    const mockError = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });
});

describe('Transactions Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://polygon-mainnet.g.alchemy.com/v2',
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

  describe('sendRawTransaction', () => {
    it('should send raw transaction successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: '0x1234567890abcdef'
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'sendRawTransaction';
        if (paramName === 'data') return '0xf86c808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a76400008025a04f4c17305743700648bc4f6cd3038ec6f6af0df73e31757d1e234e34c1e92e9b8a03e4657a0dba8c5c5dd87f3d7c6b1c6c5b5a0c5a5e5f5d5c5b5a5e5f5d5c5b5';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.result).toBe('0x1234567890abcdef');
    });

    it('should handle sendRawTransaction error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'sendRawTransaction';
        if (paramName === 'data') return '0xinvaliddata';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid transaction data'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Invalid transaction data');
    });
  });

  describe('getTransactionByHash', () => {
    it('should get transaction by hash successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: {
          hash: '0x1234567890abcdef',
          blockNumber: '0x1b4',
          from: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
          to: '0x85f43d8a49eeb85d32cf465507dd71d507100c1d0',
          value: '0x186a0'
        }
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getTransactionByHash';
        if (paramName === 'hash') return '0x1234567890abcdef';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.result.hash).toBe('0x1234567890abcdef');
    });
  });

  describe('estimateGas', () => {
    it('should estimate gas successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: '0x5208'
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, index: number, defaultValue: string = '') => {
        if (paramName === 'operation') return 'estimateGas';
        if (paramName === 'to') return '0x3535353535353535353535353535353535353535';
        if (paramName === 'from') return '0x407d73d8a49eeb85d32cf465507dd71d507100c1';
        if (paramName === 'value') return '0x9184e72a';
        return defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.result).toBe('0x5208');
    });
  });

  describe('getTransactionByHashProxy', () => {
    it('should get transaction by hash via proxy successfully', async () => {
      const mockResponse = {
        status: '1',
        message: 'OK',
        result: {
          hash: '0x1234567890abcdef',
          blockNumber: '0x1b4'
        }
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getTransactionByHashProxy';
        if (paramName === 'txhash') return '0x1234567890abcdef';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.status).toBe('1');
      expect(result[0].json.result.hash).toBe('0x1234567890abcdef');
    });
  });
});

describe('Blocks Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://polygon-mainnet.g.alchemy.com/v2',
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

  describe('getBlockByNumber', () => {
    it('should get block by number successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: {
          number: '0x1b4',
          hash: '0x123abc',
          transactions: [],
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getBlockByNumber';
          case 'block': return 'latest';
          case 'fullTransactions': return false;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

      const items = [{ json: {} }];
      const result = await executeBlocksOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getBlockByNumber';
          case 'block': return 'latest';
          case 'fullTransactions': return false;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const items = [{ json: {} }];

      await expect(executeBlocksOperations.call(mockExecuteFunctions, items)).rejects.toThrow();
    });
  });

  describe('getBlockByHash', () => {
    it('should get block by hash successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: {
          number: '0x1b4',
          hash: '0x123abc',
          transactions: [],
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getBlockByHash';
          case 'hash': return '0x123abc';
          case 'fullTransactions': return true;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

      const items = [{ json: {} }];
      const result = await executeBlocksOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('blockNumber', () => {
    it('should get latest block number successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: '0x1b4',
      };

      mockExecuteFunctions.getNodeParameter.mockReturnValue('blockNumber');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

      const items = [{ json: {} }];
      const result = await executeBlocksOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('proxy', () => {
    it('should get block via proxy successfully', async () => {
      const mockResponse = {
        status: '1',
        message: 'OK',
        result: {
          number: '0x1b4',
          hash: '0x123abc',
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'proxy';
          case 'tag': return 'latest';
          case 'boolean': return true;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeBlocksOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('block rewards', () => {
    it('should get block rewards successfully', async () => {
      const mockResponse = {
        status: '1',
        message: 'OK',
        result: {
          blockNumber: '123456',
          blockReward: '2000000000000000000',
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'block';
          case 'blockno': return '123456';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeBlocksOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
});

describe('Tokens Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://polygon-mainnet.g.alchemy.com/v2',
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

  it('should get token balance via JSON-RPC', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getTokenBalance';
        case 'contractAddress': return '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';
        case 'data': return '0x70a08231000000000000000000000000742E0C9E4F0A55f6bF9aFd95c1fea2bb';
        case 'block': return 'latest';
        default: return '';
      }
    });

    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: '0x0000000000000000000000000000000000000000000000000000000ba43b7400',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://polygon-mainnet.g.alchemy.com/v2/test-api-key',
      headers: { 'Content-Type': 'application/json' },
      json: true,
      body: {
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [
          {
            to: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
            data: '0x70a08231000000000000000000000000742E0C9E4F0A55f6bF9aFd95c1fea2bb',
          },
          'latest',
        ],
        id: 1,
      },
    });
  });

  it('should get token balance via API', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getTokenBalanceApi';
        case 'contractaddress': return '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';
        case 'address': return '0x742E0C9E4F0A55f6bF9aFd95c1fea2bb';
        case 'tag': return 'latest';
        default: return '';
      }
    });

    const mockResponse = {
      status: '1',
      message: 'OK',
      result: '50000000000',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should get token supply', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getTokenSupply';
        case 'contractaddress': return '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';
        default: return '';
      }
    });

    const mockResponse = {
      status: '1',
      message: 'OK',
      result: '2774851725477',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should get token transfers', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getTokenTransfers';
        case 'contractaddress': return '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';
        case 'address': return '0x742E0C9E4F0A55f6bF9aFd95c1fea2bb';
        case 'page': return 1;
        case 'offset': return 100;
        case 'sort': return 'desc';
        default: return '';
      }
    });

    const mockResponse = {
      status: '1',
      message: 'OK',
      result: [
        {
          blockNumber: '48912345',
          timeStamp: '1678901234',
          hash: '0xabc123',
          from: '0x742E0C9E4F0A55f6bF9aFd95c1fea2bb',
          to: '0x456def',
          value: '1000000',
          contractAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
          tokenName: 'USD Coin',
          tokenSymbol: 'USDC',
          tokenDecimal: '6',
        },
      ],
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getTokenBalance';
        case 'contractAddress': return '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';
        case 'data': return '0x70a08231000000000000000000000000742E0C9E4F0A55f6bF9aFd95c1fea2bb';
        case 'block': return 'latest';
        default: return '';
      }
    });

    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

    await expect(executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'unknownOperation';
      return '';
    });

    await expect(executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('NFTs Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://polygon-mainnet.g.alchemy.com/v2',
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

  test('should get NFT owner successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getNFTOwner';
        case 'to': return '0x1234567890123456789012345678901234567890';
        case 'data': return '0x6352211e0000000000000000000000000000000000000000000000000000000000000001';
        case 'block': return 'latest';
        default: return null;
      }
    });

    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: '0x000000000000000000000000abcdefabcdefabcdefabcdefabcdefabcdefabcd',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNFTsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://polygon-mainnet.g.alchemy.com/v2/test-api-key',
      })
    );
  });

  test('should get NFT metadata URI successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getNFTMetadataURI';
        case 'to': return '0x1234567890123456789012345678901234567890';
        case 'data': return '0xc87b56dd0000000000000000000000000000000000000000000000000000000000000001';
        case 'block': return 'latest';
        default: return null;
      }
    });

    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001f68747470733a2f2f6170692e6578616d706c652e636f6d2f746f6b656e2f31',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNFTsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should get ERC721 transfers successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getERC721Transfers';
        case 'contractAddress': return '0x1234567890123456789012345678901234567890';
        case 'address': return '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
        case 'page': return 1;
        case 'offset': return 100;
        case 'sort': return 'asc';
        default: return null;
      }
    });

    const mockResponse = {
      status: '1',
      message: 'OK',
      result: [
        {
          blockNumber: '12345678',
          timeStamp: '1640995200',
          hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          from: '0x1234567890123456789012345678901234567890',
          to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          tokenID: '1',
          tokenName: 'Test NFT',
          tokenSymbol: 'TNFT',
        },
      ],
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNFTsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('api.polygonscan.com/api'),
      })
    );
  });

  test('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getNFTOwner';
      return null;
    });
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeNFTsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  test('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getNFTOwner';
      return null;
    });
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(executeNFTsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
  });
});

describe('SmartContracts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://polygon-mainnet.g.alchemy.com/v2',
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

  it('should call contract function successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'call';
        case 'to': return '0x1234567890123456789012345678901234567890';
        case 'data': return '0x70a08231000000000000000000000000abcd1234567890123456789012345678901234abcd';
        case 'block': return 'latest';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      result: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
    }));

    const items = [{ json: {} }];
    const result = await executeSmartContractsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toBe('0x0000000000000000000000000000000000000000000000000de0b6b3a7640000');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://polygon-mainnet.g.alchemy.com/v2/test-api-key',
      headers: { 'Content-Type': 'application/json' },
      body: expect.stringContaining('eth_call'),
      json: false,
    });
  });

  it('should estimate gas successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'estimateGas';
        case 'to': return '0x1234567890123456789012345678901234567890';
        case 'from': return '0xabcd1234567890123456789012345678901234abcd';
        case 'data': return '0xa9059cbb';
        case 'value': return '0x0';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      result: '0x5208',
    }));

    const items = [{ json: {} }];
    const result = await executeSmartContractsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toBe('0x5208');
  });

  it('should get contract logs successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getLogs';
        case 'fromBlock': return '0x1000000';
        case 'toBlock': return 'latest';
        case 'address': return '0x1234567890123456789012345678901234567890';
        case 'topics': return { topic: [{ value: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' }] };
        default: return undefined;
      }
    });

    const mockLogs = [
      {
        address: '0x1234567890123456789012345678901234567890',
        topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
        data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
        blockNumber: '0x1000001',
        transactionHash: '0xabcd1234567890123456789012345678901234567890123456789012345678901234',
      },
    ];

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      result: mockLogs,
    }));

    const items = [{ json: {} }];
    const result = await executeSmartContractsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockLogs);
  });

  it('should get contract ABI successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getContractAbi';
        case 'address': return '0x1234567890123456789012345678901234567890';
        default: return undefined;
      }
    });

    const mockAbi = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"type":"function"}]';
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      status: '1',
      message: 'OK',
      result: mockAbi,
    });

    const items = [{ json: {} }];
    const result = await executeSmartContractsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.address).toBe('0x1234567890123456789012345678901234567890');
    expect(result[0].json.abi).toEqual(JSON.parse(mockAbi));
  });

  it('should handle API errors properly', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'call';
        case 'to': return '0x1234567890123456789012345678901234567890';
        case 'data': return '0x70a08231';
        case 'block': return 'latest';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      error: { code: -32000, message: 'execution reverted' },
    }));

    const items = [{ json: {} }];

    await expect(
      executeSmartContractsOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow();
  });

  it('should verify contract successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'verifyContract';
        case 'address': return '0x1234567890123456789012345678901234567890';
        case 'contractSourceCode': return 'pragma solidity ^0.8.0; contract Test {}';
        case 'contractName': return 'Test';
        case 'compilerVersion': return 'v0.8.19+commit.7dd6d404';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      status: '1',
      message: 'OK',
      result: 'abc123def456',
    });

    const items = [{ json: {} }];
    const result = await executeSmartContractsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.address).toBe('0x1234567890123456789012345678901234567890');
    expect(result[0].json.guid).toBe('abc123def456');
    expect(result[0].json.message).toBe('Contract verification submitted successfully');
  });
});

describe('Events Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://polygon-mainnet.g.alchemy.com/v2',
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

  describe('getLogs operation', () => {
    it('should successfully get logs', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        result: [
          {
            address: '0x1234567890123456789012345678901234567890',
            topics: ['0xabcdef1234567890'],
            data: '0x1234',
            blockNumber: '0x1b4',
            transactionHash: '0xabcdef',
          },
        ],
        id: 1,
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getLogs';
          case 'fromBlock': return 'latest';
          case 'toBlock': return 'latest';
          case 'address': return '0x1234567890123456789012345678901234567890';
          case 'topics': return { topic: [{ value: '0xabcdef1234567890' }] };
          case 'blockhash': return '';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEventsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toHaveLength(1);
      expect(result[0].json[0].address).toBe('0x1234567890123456789012345678901234567890');
    });

    it('should handle API errors for getLogs', async () => {
      const mockErrorResponse = JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32602, message: 'Invalid params' },
        id: 1,
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getLogs';
          case 'fromBlock': return 'latest';
          case 'toBlock': return 'latest';
          case 'address': return '';
          case 'topics': return {};
          case 'blockhash': return '';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

      await expect(executeEventsOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow();
    });
  });

  describe('newFilter operation', () => {
    it('should successfully create a new filter', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        result: '0x1',
        id: 1,
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'newFilter';
          case 'fromBlock': return 'latest';
          case 'toBlock': return 'latest';
          case 'address': return '0x1234567890123456789012345678901234567890';
          case 'topics': return { topic: [{ value: '0xabcdef1234567890' }] };
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEventsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.filterId).toBe('0x1');
    });
  });

  describe('getFilterChanges operation', () => {
    it('should successfully get filter changes', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        result: [
          {
            address: '0x1234567890123456789012345678901234567890',
            topics: ['0xabcdef1234567890'],
            data: '0x1234',
          },
        ],
        id: 1,
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getFilterChanges';
          case 'filterId': return '0x1';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEventsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toHaveLength(1);
    });
  });

  describe('getFilterLogs operation', () => {
    it('should successfully get filter logs', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        result: [
          {
            address: '0x1234567890123456789012345678901234567890',
            topics: ['0xabcdef1234567890'],
            data: '0x1234',
          },
        ],
        id: 1,
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getFilterLogs';
          case 'filterId': return '0x1';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEventsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toHaveLength(1);
    });
  });

  describe('uninstallFilter operation', () => {
    it('should successfully uninstall filter', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        result: true,
        id: 1,
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'uninstallFilter';
          case 'filterId': return '0x1';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEventsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.uninstalled).toBe(true);
    });
  });
});
});
