/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-polygon/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class Polygon implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Polygon',
    name: 'polygon',
    icon: 'file:polygon.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Polygon API',
    defaults: {
      name: 'Polygon',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'polygonApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Accounts',
            value: 'accounts',
          },
          {
            name: 'Transactions',
            value: 'transactions',
          },
          {
            name: 'Block',
            value: 'block',
          },
          {
            name: 'Transaction',
            value: 'transaction',
          },
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Tokens',
            value: 'tokens',
          },
          {
            name: 'NFTs',
            value: 'nFTs',
          },
          {
            name: 'SmartContracts',
            value: 'smartContracts',
          },
          {
            name: 'SmartContract',
            value: 'smartContract',
          },
          {
            name: 'Token',
            value: 'token',
          },
          {
            name: 'Events',
            value: 'events',
          },
          {
            name: 'Network',
            value: 'network',
          }
        ],
        default: 'accounts',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
    },
  },
  options: [
    {
      name: 'Get Balance',
      value: 'getBalance',
      description: 'Get account balance for a given address',
      action: 'Get account balance',
    },
    {
      name: 'Get Transaction Count',
      value: 'getTransactionCount',
      description: 'Get account nonce/transaction count',
      action: 'Get transaction count',
    },
    {
      name: 'Get Transaction List',
      value: 'getTransactionList',
      description: 'Get list of transactions for an account',
      action: 'Get transaction list',
    },
    {
      name: 'Get Internal Transactions',
      value: 'getInternalTransactions',
      description: 'Get internal transactions for an account',
      action: 'Get internal transactions',
    },
    {
      name: 'Get ERC20 Token Transfers',
      value: 'getErc20Transfers',
      description: 'Get ERC20 token transfers for an account',
      action: 'Get ERC20 token transfers',
    },
    {
      name: 'Get ERC721 Token Transfers',
      value: 'getErc721Transfers',
      description: 'Get ERC721 token transfers for an account',
      action: 'Get ERC721 token transfers',
    },
  ],
  default: 'getBalance',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
    },
  },
  options: [
    {
      name: 'Send Raw Transaction',
      value: 'sendRawTransaction',
      description: 'Broadcast a signed transaction to the network',
      action: 'Send raw transaction',
    },
    {
      name: 'Get Transaction by Hash',
      value: 'getTransactionByHash',
      description: 'Get transaction details by transaction hash',
      action: 'Get transaction by hash',
    },
    {
      name: 'Get Transaction Receipt',
      value: 'getTransactionReceipt',
      description: 'Get transaction receipt and status',
      action: 'Get transaction receipt',
    },
    {
      name: 'Estimate Gas',
      value: 'estimateGas',
      description: 'Estimate gas required for a transaction',
      action: 'Estimate gas',
    },
    {
      name: 'Get Gas Price',
      value: 'gasPrice',
      description: 'Get current gas price',
      action: 'Get gas price',
    },
    {
      name: 'Get Transaction by Hash (Proxy)',
      value: 'getTransactionByHashProxy',
      description: 'Get transaction details by hash via proxy API',
      action: 'Get transaction by hash via proxy',
    },
    {
      name: 'Get Transaction Receipt (Proxy)',
      value: 'getTransactionReceiptProxy',
      description: 'Get transaction receipt via proxy API',
      action: 'Get transaction receipt via proxy',
    },
  ],
  default: 'sendRawTransaction',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['block'] } },
	options: [
		{
			name: 'Get Block by Number',
			value: 'getByNumber',
			description: 'Get block information by block number',
			action: 'Get block by number',
		},
		{
			name: 'Get Block by Hash',
			value: 'getByHash',
			description: 'Get block information by block hash',
			action: 'Get block by hash',
		},
		{
			name: 'Get Latest Block Number',
			value: 'getLatestNumber',
			description: 'Get the latest block number',
			action: 'Get latest block number',
		},
		{
			name: 'Get Transaction Count by Block Number',
			value: 'getTxCountByNumber',
			description: 'Get transaction count in block by number',
			action: 'Get transaction count by block number',
		},
		{
			name: 'Get Transaction Count by Block Hash',
			value: 'getTxCountByHash',
			description: 'Get transaction count in block by hash',
			action: 'Get transaction count by block hash',
		},
	],
	default: 'getByNumber',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['transaction'] } },
	options: [
		{ name: 'Get Transaction by Hash', value: 'getTransactionByHash', description: 'Get transaction details by transaction hash', action: 'Get transaction by hash' },
		{ name: 'Get Transaction Receipt', value: 'getTransactionReceipt', description: 'Get transaction receipt by transaction hash', action: 'Get transaction receipt' },
		{ name: 'Send Raw Transaction', value: 'sendRawTransaction', description: 'Send a signed raw transaction to the network', action: 'Send raw transaction' },
		{ name: 'Get Transaction by Block Hash and Index', value: 'getTransactionByBlockHashAndIndex', description: 'Get transaction by block hash and index position', action: 'Get transaction by block hash and index' },
		{ name: 'Get Transaction by Block Number and Index', value: 'getTransactionByBlockNumberAndIndex', description: 'Get transaction by block number and index position', action: 'Get transaction by block number and index' },
		{ name: 'Get Transaction Count', value: 'getTransactionCount', description: 'Get the number of transactions sent from an address', action: 'Get transaction count' }
	],
	default: 'getTransactionByHash',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    {
      name: 'Get Balance',
      value: 'getBalance',
      description: 'Get account balance',
      action: 'Get account balance'
    },
    {
      name: 'Get Transaction Count',
      value: 'getTransactionCount',
      description: 'Get account nonce',
      action: 'Get account transaction count'
    },
    {
      name: 'Get Code',
      value: 'getCode',
      description: 'Get contract bytecode',
      action: 'Get contract code'
    },
    {
      name: 'Get Storage At',
      value: 'getStorageAt',
      description: 'Get storage value at position',
      action: 'Get storage value at position'
    }
  ],
  default: 'getBalance',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
    },
  },
  options: [
    {
      name: 'Get Token Balance (JSON-RPC)',
      value: 'getTokenBalance',
      description: 'Get token balance using JSON-RPC call',
      action: 'Get token balance using JSON-RPC',
    },
    {
      name: 'Get Token Metadata (JSON-RPC)',
      value: 'getTokenMetadata',
      description: 'Get token metadata using JSON-RPC call',
      action: 'Get token metadata using JSON-RPC',
    },
    {
      name: 'Get Token Balance (API)',
      value: 'getTokenBalanceApi',
      description: 'Get token balance using PolygonScan API',
      action: 'Get token balance using API',
    },
    {
      name: 'Get ERC20 Token Supply',
      value: 'getTokenSupply',
      description: 'Get ERC20 token total supply',
      action: 'Get ERC20 token supply',
    },
    {
      name: 'Get ERC20 Token Info',
      value: 'getTokenInfo',
      description: 'Get ERC20 token information',
      action: 'Get ERC20 token information',
    },
    {
      name: 'Get Token Transfers',
      value: 'getTokenTransfers',
      description: 'Get list of token transfers for an account',
      action: 'Get token transfers',
    },
  ],
  default: 'getTokenBalance',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['nFTs'],
    },
  },
  options: [
    {
      name: 'Get NFT Owner',
      value: 'getNFTOwner',
      description: 'Get the owner of an NFT token',
      action: 'Get NFT owner',
    },
    {
      name: 'Get NFT Metadata URI',
      value: 'getNFTMetadataURI',
      description: 'Get the metadata URI of an NFT token',
      action: 'Get NFT metadata URI',
    },
    {
      name: 'Get NFT Approved Address',
      value: 'getNFTApprovedAddress',
      description: 'Get the approved address for an NFT token',
      action: 'Get NFT approved address',
    },
    {
      name: 'Get ERC721 Transfers',
      value: 'getERC721Transfers',
      description: 'Get ERC721 token transfer history',
      action: 'Get ERC721 transfers',
    },
    {
      name: 'Get ERC1155 Transfers',
      value: 'getERC1155Transfers',
      description: 'Get ERC1155 token transfer history',
      action: 'Get ERC1155 transfers',
    },
  ],
  default: 'getNFTOwner',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
    },
  },
  options: [
    {
      name: 'Call Contract Function',
      value: 'call',
      description: 'Execute read-only contract function',
      action: 'Call contract function',
    },
    {
      name: 'Estimate Gas',
      value: 'estimateGas',
      description: 'Estimate gas for contract interaction',
      action: 'Estimate gas for transaction',
    },
    {
      name: 'Get Logs',
      value: 'getLogs',
      description: 'Get contract event logs',
      action: 'Get contract event logs',
    },
    {
      name: 'Get Contract ABI',
      value: 'getContractAbi',
      description: 'Get contract ABI from explorer',
      action: 'Get contract ABI',
    },
    {
      name: 'Get Contract Source Code',
      value: 'getContractSource',
      description: 'Get contract source code from explorer',
      action: 'Get contract source code',
    },
    {
      name: 'Verify Contract',
      value: 'verifyContract',
      description: 'Verify contract source code',
      action: 'Verify contract source code',
    },
  ],
  default: 'call',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['smartContract'],
		},
	},
	options: [
		{
			name: 'Call Contract Method',
			value: 'callMethod',
			description: 'Call a contract method without creating a transaction',
			action: 'Call contract method',
		},
		{
			name: 'Estimate Gas',
			value: 'estimateGas',
			description: 'Estimate gas required for a contract interaction',
			action: 'Estimate gas for contract interaction',
		},
		{
			name: 'Get Contract Code',
			value: 'getCode',
			description: 'Get the bytecode of a smart contract',
			action: 'Get contract bytecode',
		},
		{
			name: 'Get Event Logs',
			value: 'getLogs',
			description: 'Get contract event logs based on filter criteria',
			action: 'Get contract event logs',
		},
	],
	default: 'callMethod',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['token'],
    },
  },
  options: [
    {
      name: 'Get Balance',
      value: 'getBalance',
      description: 'Get token balance for an address',
      action: 'Get token balance',
    },
    {
      name: 'Get Metadata',
      value: 'getMetadata',
      description: 'Get token metadata information',
      action: 'Get token metadata',
    },
    {
      name: 'Get Transfer Events',
      value: 'getTransferEvents',
      description: 'Get token transfer events using eth_getLogs',
      action: 'Get token transfer events',
    },
    {
      name: 'Get Allowance',
      value: 'getAllowance',
      description: 'Get token allowance between owner and spender',
      action: 'Get token allowance',
    },
  ],
  default: 'getBalance',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['events'],
    },
  },
  options: [
    {
      name: 'Get Logs',
      value: 'getLogs',
      description: 'Filter and retrieve event logs from the blockchain',
      action: 'Get event logs',
    },
    {
      name: 'New Filter',
      value: 'newFilter',
      description: 'Create a new log filter for monitoring events',
      action: 'Create new filter',
    },
    {
      name: 'Get Filter Changes',
      value: 'getFilterChanges',
      description: 'Get new entries from an existing filter',
      action: 'Get filter changes',
    },
    {
      name: 'Get Filter Logs',
      value: 'getFilterLogs',
      description: 'Get all logs matching an existing filter',
      action: 'Get all filter logs',
    },
    {
      name: 'Uninstall Filter',
      value: 'uninstallFilter',
      description: 'Remove an existing filter',
      action: 'Remove filter',
    },
  ],
  default: 'getLogs',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['network'] } },
  options: [
    { name: 'Get Chain ID', value: 'getChainId', description: 'Get the chain ID of the network', action: 'Get chain ID' },
    { name: 'Get Gas Price', value: 'getGasPrice', description: 'Get the current gas price', action: 'Get gas price' },
    { name: 'Get Fee History', value: 'getFeeHistory', description: 'Get fee history for specified blocks', action: 'Get fee history' },
    { name: 'Get Network Version', value: 'getNetworkVersion', description: 'Get the network version', action: 'Get network version' },
    { name: 'Get Client Version', value: 'getClientVersion', description: 'Get the client version', action: 'Get client version' }
  ],
  default: 'getChainId',
},
      // Parameter definitions
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getBalance', 'getTransactionCount', 'getTransactionList', 'getInternalTransactions', 'getErc20Transfers', 'getErc721Transfers'],
    },
  },
  default: '',
  description: 'The account address to query',
},
{
  displayName: 'Block',
  name: 'block',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getBalance', 'getTransactionCount'],
    },
  },
  default: 'latest',
  description: 'Block number (hex), or one of: latest, earliest, pending',
},
{
  displayName: 'Start Block',
  name: 'startblock',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getTransactionList', 'getInternalTransactions', 'getErc20Transfers', 'getErc721Transfers'],
    },
  },
  default: '0',
  description: 'Starting block number',
},
{
  displayName: 'End Block',
  name: 'endblock',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getTransactionList', 'getInternalTransactions', 'getErc20Transfers', 'getErc721Transfers'],
    },
  },
  default: '99999999',
  description: 'Ending block number',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getTransactionList', 'getInternalTransactions', 'getErc20Transfers', 'getErc721Transfers'],
    },
  },
  default: 1,
  description: 'Page number',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getTransactionList', 'getInternalTransactions', 'getErc20Transfers', 'getErc721Transfers'],
    },
  },
  default: 10,
  description: 'Number of records to return per page',
},
{
  displayName: 'Sort',
  name: 'sort',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getTransactionList', 'getInternalTransactions', 'getErc20Transfers', 'getErc721Transfers'],
    },
  },
  options: [
    {
      name: 'Ascending',
      value: 'asc',
    },
    {
      name: 'Descending',
      value: 'desc',
    },
  ],
  default: 'desc',
  description: 'Sort order',
},
{
  displayName: 'Contract Address',
  name: 'contractaddress',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getErc20Transfers', 'getErc721Transfers'],
    },
  },
  default: '',
  description: 'Contract address for token transfers (optional)',
},
{
  displayName: 'Raw Transaction Data',
  name: 'data',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['sendRawTransaction'],
    },
  },
  default: '',
  description: 'The signed transaction data in hexadecimal format',
},
{
  displayName: 'Transaction Hash',
  name: 'hash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransactionByHash', 'getTransactionReceipt'],
    },
  },
  default: '',
  description: 'The transaction hash to query',
},
{
  displayName: 'To Address',
  name: 'to',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['estimateGas'],
    },
  },
  default: '',
  description: 'The address the transaction is directed to',
},
{
  displayName: 'From Address',
  name: 'from',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['estimateGas'],
    },
  },
  default: '',
  description: 'The address the transaction is sent from (optional)',
},
{
  displayName: 'Value',
  name: 'value',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['estimateGas'],
    },
  },
  default: '',
  description: 'Integer of the value sent with this transaction (optional)',
},
{
  displayName: 'Data',
  name: 'estimateData',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['estimateGas'],
    },
  },
  default: '',
  description: 'Hash of the method signature and encoded parameters (optional)',
},
{
  displayName: 'Transaction Hash',
  name: 'txhash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransactionByHashProxy', 'getTransactionReceiptProxy'],
    },
  },
  default: '',
  description: 'The transaction hash to query via proxy',
},
{
	displayName: 'Block Number',
	name: 'blockNumber',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['block'],
			operation: ['getByNumber', 'getTxCountByNumber'],
		},
	},
	default: 'latest',
	description: 'Block number in hex format, or "latest", "earliest", "pending"',
},
{
	displayName: 'Block Hash',
	name: 'blockHash',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['block'],
			operation: ['getByHash', 'getTxCountByHash'],
		},
	},
	default: '',
	description: 'Block hash in hex format',
},
{
	displayName: 'Full Transactions',
	name: 'fullTransactions',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['block'],
			operation: ['getByNumber', 'getByHash'],
		},
	},
	default: false,
	description: 'Whether to return full transaction objects (true) or just transaction hashes (false)',
},
{
	displayName: 'Transaction Hash',
	name: 'transactionHash',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransactionByHash', 'getTransactionReceipt']
		}
	},
	default: '',
	placeholder: '0x...',
	description: 'The hash of the transaction to retrieve'
},
{
	displayName: 'Signed Transaction Data',
	name: 'signedTransactionData',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['sendRawTransaction']
		}
	},
	default: '',
	placeholder: '0x...',
	description: 'The signed transaction data to send to the network'
},
{
	displayName: 'Block Hash',
	name: 'blockHash',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransactionByBlockHashAndIndex']
		}
	},
	default: '',
	placeholder: '0x...',
	description: 'The hash of the block containing the transaction'
},
{
	displayName: 'Block Number',
	name: 'blockNumber',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransactionByBlockNumberAndIndex', 'getTransactionCount']
		}
	},
	default: 'latest',
	placeholder: 'latest, earliest, pending, or hex number',
	description: 'The block number (latest, earliest, pending, or hex value)'
},
{
	displayName: 'Transaction Index',
	name: 'transactionIndex',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransactionByBlockHashAndIndex', 'getTransactionByBlockNumberAndIndex']
		}
	},
	default: '0x0',
	placeholder: '0x0',
	description: 'The index position of the transaction in the block (hex value)'
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransactionCount']
		}
	},
	default: '',
	placeholder: '0x...',
	description: 'The address to get the transaction count for'
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getBalance', 'getTransactionCount', 'getCode', 'getStorageAt']
    }
  },
  default: '',
  placeholder: '0x742d35Cc6634C0532925a3b8D4c0746E47516b2C',
  description: 'The address to query'
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getBalance', 'getTransactionCount', 'getCode', 'getStorageAt']
    }
  },
  default: 'latest',
  placeholder: 'latest',
  description: 'Block number (latest, earliest, pending, or hex value)'
},
{
  displayName: 'Storage Position',
  name: 'position',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getStorageAt']
    }
  },
  default: '0x0',
  placeholder: '0x0',
  description: 'The storage position (hex value)'
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['getTokenBalance', 'getTokenMetadata'],
    },
  },
  default: '',
  description: 'The contract address to call',
},
{
  displayName: 'Call Data',
  name: 'data',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['getTokenBalance', 'getTokenMetadata'],
    },
  },
  default: '',
  description: 'The encoded function call data',
},
{
  displayName: 'Block Number',
  name: 'block',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['getTokenBalance', 'getTokenMetadata'],
    },
  },
  default: 'latest',
  description: 'Block number (latest, earliest, pending, or hex value)',
},
{
  displayName: 'Contract Address',
  name: 'contractaddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['getTokenBalanceApi', 'getTokenSupply', 'getTokenInfo', 'getTokenTransfers'],
    },
  },
  default: '',
  description: 'The contract address of the ERC token',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['getTokenBalanceApi', 'getTokenTransfers'],
    },
  },
  default: '',
  description: 'The address to check balance for',
},
{
  displayName: 'Tag',
  name: 'tag',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['getTokenBalanceApi'],
    },
  },
  options: [
    {
      name: 'Latest',
      value: 'latest',
    },
    {
      name: 'Earliest',
      value: 'earliest',
    },
    {
      name: 'Pending',
      value: 'pending',
    },
  ],
  default: 'latest',
  description: 'The block number to query',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['getTokenTransfers'],
    },
  },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['getTokenTransfers'],
    },
  },
  default: 100,
  description: 'Number of records per page (max 10000)',
},
{
  displayName: 'Sort',
  name: 'sort',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['getTokenTransfers'],
    },
  },
  options: [
    {
      name: 'Ascending',
      value: 'asc',
    },
    {
      name: 'Descending',
      value: 'desc',
    },
  ],
  default: 'desc',
  description: 'Sort order by block number',
},
{
  displayName: 'Contract Address',
  name: 'to',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nFTs'],
      operation: ['getNFTOwner', 'getNFTMetadataURI', 'getNFTApprovedAddress'],
    },
  },
  default: '',
  description: 'The NFT contract address',
},
{
  displayName: 'Encoded Function Call',
  name: 'data',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nFTs'],
      operation: ['getNFTOwner', 'getNFTMetadataURI', 'getNFTApprovedAddress'],
    },
  },
  default: '',
  description: 'The encoded function call data',
},
{
  displayName: 'Block',
  name: 'block',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['nFTs'],
      operation: ['getNFTOwner', 'getNFTMetadataURI', 'getNFTApprovedAddress'],
    },
  },
  default: 'latest',
  description: 'Block number (hex), or "latest", "earliest", "pending"',
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['nFTs'],
      operation: ['getERC721Transfers', 'getERC1155Transfers'],
    },
  },
  default: '',
  description: 'The token contract address (optional)',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nFTs'],
      operation: ['getERC721Transfers', 'getERC1155Transfers'],
    },
  },
  default: '',
  description: 'The address to get transfer history for',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['nFTs'],
      operation: ['getERC721Transfers', 'getERC1155Transfers'],
    },
  },
  default: 1,
  description: 'The page number to retrieve',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['nFTs'],
      operation: ['getERC721Transfers', 'getERC1155Transfers'],
    },
  },
  default: 100,
  description: 'The number of results per page (max 10000)',
},
{
  displayName: 'Sort',
  name: 'sort',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['nFTs'],
      operation: ['getERC721Transfers', 'getERC1155Transfers'],
    },
  },
  options: [
    {
      name: 'Ascending',
      value: 'asc',
    },
    {
      name: 'Descending',
      value: 'desc',
    },
  ],
  default: 'asc',
  description: 'Sort order for results',
},
{
  displayName: 'Contract Address',
  name: 'to',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['call', 'estimateGas'],
    },
  },
  default: '',
  description: 'The contract address to interact with',
},
{
  displayName: 'Function Data',
  name: 'data',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['call', 'estimateGas'],
    },
  },
  default: '',
  description: 'Encoded function call data (ABI encoded)',
},
{
  displayName: 'Block Number',
  name: 'block',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['call'],
    },
  },
  default: 'latest',
  description: 'Block number (latest, earliest, pending, or hex number)',
},
{
  displayName: 'From Address',
  name: 'from',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['estimateGas'],
    },
  },
  default: '',
  description: 'The address the transaction is sent from',
},
{
  displayName: 'Value',
  name: 'value',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['estimateGas'],
    },
  },
  default: '0x0',
  description: 'Value in wei to send with the transaction',
},
{
  displayName: 'From Block',
  name: 'fromBlock',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['getLogs'],
    },
  },
  default: 'latest',
  description: 'Starting block number (latest, earliest, pending, or hex number)',
},
{
  displayName: 'To Block',
  name: 'toBlock',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['getLogs'],
    },
  },
  default: 'latest',
  description: 'Ending block number (latest, earliest, pending, or hex number)',
},
{
  displayName: 'Contract Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['getLogs', 'getContractAbi', 'getContractSource', 'verifyContract'],
    },
  },
  default: '',
  description: 'The contract address',
},
{
  displayName: 'Topics',
  name: 'topics',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: true,
  },
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['getLogs'],
    },
  },
  default: {},
  description: 'Event topics to filter by',
  options: [
    {
      name: 'topic',
      displayName: 'Topic',
      values: [
        {
          displayName: 'Topic Value',
          name: 'value',
          type: 'string',
          default: '',
          description: 'Topic hash or null for any',
        },
      ],
    },
  ],
},
{
  displayName: 'Contract Source Code',
  name: 'contractSourceCode',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['verifyContract'],
    },
  },
  typeOptions: {
    rows: 10,
  },
  default: '',
  description: 'The Solidity source code of the contract',
},
{
  displayName: 'Contract Name',
  name: 'contractName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['verifyContract'],
    },
  },
  default: '',
  description: 'The name of the contract',
},
{
  displayName: 'Compiler Version',
  name: 'compilerVersion',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['verifyContract'],
    },
  },
  default: '',
  description: 'The Solidity compiler version used (e.g., v0.8.19+commit.7dd6d404)',
},
{
	displayName: 'Contract Address',
	name: 'contractAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['callMethod', 'estimateGas', 'getCode'],
		},
	},
	default: '',
	placeholder: '0x...',
	description: 'The address of the smart contract',
},
{
	displayName: 'Method Data',
	name: 'data',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['callMethod', 'estimateGas'],
		},
	},
	default: '',
	placeholder: '0x...',
	description: 'The encoded method call data (function selector + parameters)',
},
{
	displayName: 'From Address',
	name: 'from',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['callMethod', 'estimateGas'],
		},
	},
	default: '',
	placeholder: '0x...',
	description: 'The address the transaction is sent from (optional for eth_call)',
},
{
	displayName: 'Gas Limit',
	name: 'gas',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['callMethod', 'estimateGas'],
		},
	},
	default: '',
	placeholder: '0x...',
	description: 'Maximum gas provided for the transaction execution (hex format)',
},
{
	displayName: 'Gas Price',
	name: 'gasPrice',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['callMethod', 'estimateGas'],
		},
	},
	default: '',
	placeholder: '0x...',
	description: 'Gas price in wei (hex format)',
},
{
	displayName: 'Value',
	name: 'value',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['callMethod', 'estimateGas'],
		},
	},
	default: '0x0',
	placeholder: '0x0',
	description: 'Value sent with this transaction in wei (hex format)',
},
{
	displayName: 'Block Number',
	name: 'blockNumber',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['callMethod', 'getCode'],
		},
	},
	default: 'latest',
	placeholder: 'latest',
	description: 'Block number to query (latest, earliest, pending, or hex number)',
},
{
	displayName: 'Filter From Block',
	name: 'fromBlock',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['getLogs'],
		},
	},
	default: 'latest',
	placeholder: 'latest',
	description: 'Starting block number for log filtering',
},
{
	displayName: 'Filter To Block',
	name: 'toBlock',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['getLogs'],
		},
	},
	default: 'latest',
	placeholder: 'latest',
	description: 'Ending block number for log filtering',
},
{
	displayName: 'Filter Address',
	name: 'filterAddress',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['getLogs'],
		},
	},
	default: '',
	placeholder: '0x...',
	description: 'Contract address to filter logs from (optional)',
},
{
	displayName: 'Topics',
	name: 'topics',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['getLogs'],
		},
	},
	default: '',
	placeholder: '["0x..."]',
	description: 'Array of topics to filter logs (JSON array format, optional)',
},
{
	displayName: 'Block Hash',
	name: 'blockHash',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['getLogs'],
		},
	},
	default: '',
	placeholder: '0x...',
	description: 'Block hash to filter logs from (alternative to fromBlock/toBlock)',
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getBalance', 'getMetadata', 'getTransferEvents', 'getAllowance'],
    },
  },
  default: '',
  description: 'The token contract address',
},
{
  displayName: 'Owner Address',
  name: 'ownerAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getBalance', 'getAllowance'],
    },
  },
  default: '',
  description: 'The address to check balance or allowance for',
},
{
  displayName: 'Spender Address',
  name: 'spenderAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getAllowance'],
    },
  },
  default: '',
  description: 'The address that has the allowance',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getBalance', 'getMetadata', 'getAllowance'],
    },
  },
  default: 'latest',
  description: 'Block number to query at (latest, earliest, pending, or hex value)',
},
{
  displayName: 'From Block',
  name: 'fromBlock',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTransferEvents'],
    },
  },
  default: 'latest',
  description: 'Start block for log filtering',
},
{
  displayName: 'To Block',
  name: 'toBlock',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTransferEvents'],
    },
  },
  default: 'latest',
  description: 'End block for log filtering',
},
{
  displayName: 'From Address',
  name: 'fromAddress',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTransferEvents'],
    },
  },
  default: '',
  description: 'Filter transfers from this address (optional)',
},
{
  displayName: 'To Address',
  name: 'toAddress',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTransferEvents'],
    },
  },
  default: '',
  description: 'Filter transfers to this address (optional)',
},
{
  displayName: 'From Block',
  name: 'fromBlock',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['events'],
      operation: ['getLogs', 'newFilter'],
    },
  },
  default: 'latest',
  description: 'Starting block number (hex value, "latest", "earliest", or "pending")',
},
{
  displayName: 'To Block',
  name: 'toBlock',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['events'],
      operation: ['getLogs', 'newFilter'],
    },
  },
  default: 'latest',
  description: 'Ending block number (hex value, "latest", "earliest", or "pending")',
},
{
  displayName: 'Contract Address',
  name: 'address',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['events'],
      operation: ['getLogs', 'newFilter'],
    },
  },
  default: '',
  description: 'Contract address to filter logs from (optional)',
},
{
  displayName: 'Topics',
  name: 'topics',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: true,
  },
  displayOptions: {
    show: {
      resource: ['events'],
      operation: ['getLogs', 'newFilter'],
    },
  },
  default: {},
  description: 'Array of topics to filter by',
  options: [
    {
      name: 'topic',
      displayName: 'Topic',
      values: [
        {
          displayName: 'Topic Value',
          name: 'value',
          type: 'string',
          default: '',
          description: 'Topic hash (32-byte hex string)',
        },
      ],
    },
  ],
},
{
  displayName: 'Block Hash',
  name: 'blockhash',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['events'],
      operation: ['getLogs'],
    },
  },
  default: '',
  description: 'Block hash to restrict logs to (alternative to fromBlock/toBlock)',
},
{
  displayName: 'Filter ID',
  name: 'filterId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['events'],
      operation: ['getFilterChanges', 'getFilterLogs', 'uninstallFilter'],
    },
  },
  default: '',
  description: 'The ID of the filter to query or remove',
},
{
  displayName: 'Block Count',
  name: 'blockCount',
  type: 'number',
  required: true,
  default: 10,
  description: 'Number of blocks to fetch fee history for',
  displayOptions: {
    show: {
      resource: ['network'],
      operation: ['getFeeHistory']
    }
  }
},
{
  displayName: 'Newest Block',
  name: 'newestBlock',
  type: 'string',
  required: true,
  default: 'latest',
  description: 'The newest block number (hex), or "latest", "earliest", or "pending"',
  displayOptions: {
    show: {
      resource: ['network'],
      operation: ['getFeeHistory']
    }
  }
},
{
  displayName: 'Reward Percentiles',
  name: 'rewardPercentiles',
  type: 'string',
  required: false,
  default: '25,50,75',
  description: 'Comma-separated list of percentile values (0-100) for reward calculations',
  displayOptions: {
    show: {
      resource: ['network'],
      operation: ['getFeeHistory']
    }
  }
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'accounts':
        return [await executeAccountsOperations.call(this, items)];
      case 'transactions':
        return [await executeTransactionsOperations.call(this, items)];
      case 'block':
        return [await executeBlockOperations.call(this, items)];
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'tokens':
        return [await executeTokensOperations.call(this, items)];
      case 'nFTs':
        return [await executeNFTsOperations.call(this, items)];
      case 'smartContracts':
        return [await executeSmartContractsOperations.call(this, items)];
      case 'smartContract':
        return [await executeSmartContractOperations.call(this, items)];
      case 'token':
        return [await executeTokenOperations.call(this, items)];
      case 'events':
        return [await executeEventsOperations.call(this, items)];
      case 'network':
        return [await executeNetworkOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('polygonApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const address = this.getNodeParameter('address', i) as string;

      switch (operation) {
        case 'getBalance': {
          const block = this.getNodeParameter('block', i) as string;
          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getBalance',
              params: [address, block],
              id: 1,
            }),
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactionCount': {
          const block = this.getNodeParameter('block', i) as string;
          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getTransactionCount',
              params: [address, block],
              id: 1,
            }),
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactionList': {
          const startblock = this.getNodeParameter('startblock', i) as string;
          const endblock = this.getNodeParameter('endblock', i) as string;
          const page = this.getNodeParameter('page', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const sort = this.getNodeParameter('sort', i) as string;

          const options: any = {
            method: 'GET',
            url: 'https://api.polygonscan.com/api',
            qs: {
              module: 'account',
              action: 'txlist',
              address: address,
              startblock: startblock,
              endblock: endblock,
              page: page,
              offset: offset,
              sort: sort,
              apikey: credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getInternalTransactions': {
          const startblock = this.getNodeParameter('startblock', i) as string;
          const endblock = this.getNodeParameter('endblock', i) as string;
          const page = this.getNodeParameter('page', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const sort = this.getNodeParameter('sort', i) as string;

          const options: any = {
            method: 'GET',
            url: 'https://api.polygonscan.com/api',
            qs: {
              module: 'account',
              action: 'txlistinternal',
              address: address,
              startblock: startblock,
              endblock: endblock,
              page: page,
              offset: offset,
              sort: sort,
              apikey: credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getErc20Transfers': {
          const startblock = this.getNodeParameter('startblock', i) as string;
          const endblock = this.getNodeParameter('endblock', i) as string;
          const page = this.getNodeParameter('page', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const sort = this.getNodeParameter('sort', i) as string;
          const contractaddress = this.getNodeParameter('contractaddress', i) as string;

          const queryParams: any = {
            module: 'account',
            action: 'tokentx',
            address: address,
            startblock: startblock,
            endblock: endblock,
            page: page,
            offset: offset,
            sort: sort,
            apikey: credentials.apiKey,
          };

          if (contractaddress) {
            queryParams.contractaddress = contractaddress;
          }

          const options: any = {
            method: 'GET',
            url: 'https://api.polygonscan.com/api',
            qs: queryParams,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getErc721Transfers': {
          const startblock = this.getNodeParameter('startblock', i) as string;
          const endblock = this.getNodeParameter('endblock', i) as string;
          const page = this.getNodeParameter('page', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const sort = this.getNodeParameter('sort', i) as string;
          const contractaddress = this.getNodeParameter('contractaddress', i) as string;

          const queryParams: any = {
            module: 'account',
            action: 'tokennfttx',
            address: address,
            startblock: startblock,
            endblock: endblock,
            page: page,
            offset: offset,
            sort: sort,
            apikey: credentials.apiKey,
          };

          if (contractaddress) {
            queryParams.contractaddress = contractaddress;
          }

          const options: any = {
            method: 'GET',
            url: 'https://api.polygonscan.com/api',
            qs: queryParams,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {