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
            name: 'unknown',
            value: 'unknown',
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
            name: 'Events',
            value: 'events',
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
  displayOptions: {
    show: {
      resource: ['blocks'],
    },
  },
  options: [
    {
      name: 'Get Block By Number',
      value: 'getBlockByNumber',
      description: 'Get block information by block number',
      action: 'Get block by number',
    },
    {
      name: 'Get Block By Hash',
      value: 'getBlockByHash',
      description: 'Get block information by block hash',
      action: 'Get block by hash',
    },
    {
      name: 'Get Latest Block Number',
      value: 'blockNumber',
      description: 'Get the latest block number',
      action: 'Get latest block number',
    },
    {
      name: 'Get Block By Number (Proxy)',
      value: 'proxy',
      description: 'Get block by number via proxy API',
      action: 'Get block by number via proxy',
    },
    {
      name: 'Get Block Rewards',
      value: 'block',
      description: 'Get block rewards information',
      action: 'Get block rewards',
    },
  ],
  default: 'getBlockByNumber',
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
  name: 'block',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockByNumber'],
    },
  },
  default: 'latest',
  description: 'Block number (hex), "latest", "earliest", or "pending"',
},
{
  displayName: 'Include Full Transactions',
  name: 'fullTransactions',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockByNumber'],
    },
  },
  default: false,
  description: 'Whether to include full transaction objects',
},
{
  displayName: 'Block Hash',
  name: 'hash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockByHash'],
    },
  },
  default: '',
  description: 'Hash of the block',
},
{
  displayName: 'Include Full Transactions',
  name: 'fullTransactions',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockByHash'],
    },
  },
  default: false,
  description: 'Whether to include full transaction objects',
},
{
  displayName: 'Tag',
  name: 'tag',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['proxy'],
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
  description: 'Block parameter',
},
{
  displayName: 'Boolean',
  name: 'boolean',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['proxy'],
    },
  },
  default: true,
  description: 'Show full transaction objects',
},
{
  displayName: 'Block Number',
  name: 'blockno',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['block'],
    },
  },
  default: '',
  description: 'Block number to get rewards for',
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
      case 'unknown':
        return [await executeunknownOperations.call(this, items)];
      case 'tokens':
        return [await executeTokensOperations.call(this, items)];
      case 'nFTs':
        return [await executeNFTsOperations.call(this, items)];
      case 'smartContracts':
        return [await executeSmartContractsOperations.call(this, items)];
      case 'events':
        return [await executeEventsOperations.call(this, items)];
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
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeTransactionsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('polygonApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'sendRawTransaction': {
          const data = this.getNodeParameter('data', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_sendRawTransaction',
            params: [data],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'getTransactionByHash': {
          const hash = this.getNodeParameter('hash', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getTransactionByHash',
            params: [hash],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'getTransactionReceipt': {
          const hash = this.getNodeParameter('hash', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getTransactionReceipt',
            params: [hash],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'estimateGas': {
          const to = this.getNodeParameter('to', i) as string;
          const from = this.getNodeParameter('from', i, '') as string;
          const value = this.getNodeParameter('value', i, '') as string;
          const estimateData = this.getNodeParameter('estimateData', i, '') as string;

          const transactionObject: any = { to };
          if (from) transactionObject.from = from;
          if (value) transactionObject.value = value;
          if (estimateData) transactionObject.data = estimateData;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_estimateGas',
            params: [transactionObject],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'gasPrice': {
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_gasPrice',
            params: [],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'getTransactionByHashProxy': {
          const txhash = this.getNodeParameter('txhash', i) as string;

          const options: any = {
            method: 'GET',
            url: 'https://api.polygonscan.com/api',
            qs: {
              module: 'proxy',
              action: 'eth_getTransactionByHash',
              txhash: txhash,
              apikey: credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactionReceiptProxy': {
          const txhash = this.getNodeParameter('txhash', i) as string;

          const options: any = {
            method: 'GET',
            url: 'https://api.polygonscan.com/api',
            qs: {
              module: 'proxy',
              action: 'eth_getTransactionReceipt',
              txhash: txhash,
              apikey: credentials.apiKey,
            },
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
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeBlocksOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('polygonApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getBlockByNumber': {
          const blockNumber = this.getNodeParameter('block', i) as string;
          const fullTransactions = this.getNodeParameter('fullTransactions', i) as boolean;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: [blockNumber, fullTransactions],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'getBlockByHash': {
          const blockHash = this.getNodeParameter('hash', i) as string;
          const fullTransactions = this.getNodeParameter('fullTransactions', i) as boolean;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getBlockByHash',
            params: [blockHash, fullTransactions],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'blockNumber': {
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'proxy': {
          const tag = this.getNodeParameter('tag', i) as string;
          const boolean = this.getNodeParameter('boolean', i) as boolean;

          const queryParams = new URLSearchParams({
            module: 'proxy',
            action: 'eth_getBlockByNumber',
            tag: tag,
            boolean: boolean.toString(),
            apikey: credentials.apiKey,
          });

          const options: any = {
            method: 'GET',
            url: `https://api.polygonscan.com/api?${queryParams.toString()}`,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'block': {
          const blockno = this.getNodeParameter('blockno', i) as string;

          const queryParams = new URLSearchParams({
            module: 'block',
            action: 'getblockreward',
            blockno: blockno,
            apikey: credentials.apiKey,
          });

          const options: any = {
            method: 'GET',
            url: `https://api.polygonscan.com/api?${queryParams.toString()}`,
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
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeTokensOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('polygonApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getTokenBalance': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const data = this.getNodeParameter('data', i) as string;
          const block = this.getNodeParameter('block', i) as string;

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              jsonrpc: '2.0',
              method: 'eth_call',
              params: [
                {
                  to: contractAddress,
                  data: data,
                },
                block,
              ],
              id: 1,
            },
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenMetadata': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const data = this.getNodeParameter('data', i) as string;
          const block = this.getNodeParameter('block', i) as string;

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              jsonrpc: '2.0',
              method: 'eth_call',
              params: [
                {
                  to: contractAddress,
                  data: data,
                },
                block,
              ],
              id: 1,
            },
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenBalanceApi': {
          const contractaddress = this.getNodeParameter('contractaddress', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const tag = this.getNodeParameter('tag', i) as string;

          const options: any = {
            method: 'GET',
            url: 'https://api.polygonscan.com/api',
            qs: {
              module: 'account',
              action: 'tokenbalance',
              contractaddress: contractaddress,
              address: address,
              tag: tag,
              apikey: credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenSupply': {
          const contractaddress = this.getNodeParameter('contractaddress', i) as string;

          const options: any = {
            method: 'GET',
            url: 'https://api.polygonscan.com/api',
            qs: {
              module: 'stats',
              action: 'tokensupply',
              contractaddress: contractaddress,
              apikey: credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenInfo': {
          const contractaddress = this.getNodeParameter('contractaddress', i) as string;

          const options: any = {
            method: 'GET',
            url: 'https://api.polygonscan.com/api',
            qs: {
              module: 'token',
              action: 'tokeninfo',
              contractaddress: contractaddress,
              apikey: credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenTransfers': {
          const contractaddress = this.getNodeParameter('contractaddress', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const page = this.getNodeParameter('page', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const sort = this.getNodeParameter('sort', i) as string;

          const options: any = {
            method: 'GET',
            url: 'https://api.polygonscan.com/api',
            qs: {
              module: 'account',
              action: 'tokentx',
              contractaddress: contractaddress,
              address: address,
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

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        if (error instanceof NodeApiError || error instanceof NodeOperationError) {
          throw error;
        }
        throw new NodeApiError(this.getNode(), error, { 
          message: `Polygon API error: ${error.message}`,
          httpCode: error.statusCode || 500 
        });
      }
    }
  }

  return returnData;
}

async function executeNFTsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('polygonApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getNFTOwner': {
          const to = this.getNodeParameter('to', i) as string;
          const data = this.getNodeParameter('data', i) as string;
          const block = this.getNodeParameter('block', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [
              {
                to: to,
                data: data,
              },
              block,
            ],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNFTMetadataURI': {
          const to = this.getNodeParameter('to', i) as string;
          const data = this.getNodeParameter('data', i) as string;
          const block = this.getNodeParameter('block', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [
              {
                to: to,
                data: data,
              },
              block,
            ],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNFTApprovedAddress': {
          const to = this.getNodeParameter('to', i) as string;
          const data = this.getNodeParameter('data', i) as string;
          const block = this.getNodeParameter('block', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [
              {
                to: to,
                data: data,
              },
              block,
            ],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getERC721Transfers': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const page = this.getNodeParameter('page', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const sort = this.getNodeParameter('sort', i) as string;

          const params: any = {
            module: 'account',
            action: 'tokennfttx',
            address: address,
            page: page,
            offset: offset,
            sort: sort,
            apikey: credentials.apiKey,
          };

          if (contractAddress) {
            params.contractaddress = contractAddress;
          }

          const queryString = new URLSearchParams(params).toString();

          const options: any = {
            method: 'GET',
            url: `https://api.polygonscan.com/api?${queryString}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getERC1155Transfers': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const page = this.getNodeParameter('page', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const sort = this.getNodeParameter('sort', i) as string;

          const params: any = {
            module: 'account',
            action: 'token1155tx',
            address: address,
            page: page,
            offset: offset,
            sort: sort,
            apikey: credentials.apiKey,
          };

          if (contractAddress) {
            params.contractaddress = contractAddress;
          }

          const queryString = new URLSearchParams(params).toString();

          const options: any = {
            method: 'GET',
            url: `https://api.polygonscan.com/api?${queryString}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeSmartContractsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('polygonApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'call': {
          const to = this.getNodeParameter('to', i) as string;
          const data = this.getNodeParameter('data', i) as string;
          const block = this.getNodeParameter('block', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [
              {
                to,
                data,
              },
              block,
            ],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error);
          }
          
          result = parsedResponse.result;
          break;
        }

        case 'estimateGas': {
          const to = this.getNodeParameter('to', i) as string;
          const from = this.getNodeParameter('from', i) as string;
          const data = this.getNodeParameter('data', i) as string;
          const value = this.getNodeParameter('value', i) as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            method: 'eth_estimateGas',
            params: [
              {
                to,
                data,
              },
            ],
            id: 1,
          };

          if (from) {
            requestBody.params[0].from = from;
          }
          
          if (value && value !== '0x0') {
            requestBody.params[0].value = value;
          }

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error);
          }
          
          result = parsedResponse.result;
          break;
        }

        case 'getLogs': {
          const fromBlock = this.getNodeParameter('fromBlock', i) as string;
          const toBlock = this.getNodeParameter('toBlock', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const topicsParam = this.getNodeParameter('topics', i) as any;

          const topics = topicsParam.topic ? topicsParam.topic.map((t: any) => t.value) : [];

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getLogs',
            params: [
              {
                fromBlock,
                toBlock,
                address,
                topics: topics.length > 0 ? topics : undefined,
              },
            ],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error);
          }
          
          result = parsedResponse.result;
          break;
        }

        case 'getContractAbi': {
          const address = this.getNodeParameter('address', i) as string;

          const options: any = {
            method: 'GET',
            url: 'https://api.polygonscan.com/api',
            qs: {
              module: 'contract',
              action: 'getabi',
              address,
              apikey: credentials.apiKey,
            },
            json: true,
          };

          const response = await this.helpers.httpRequest(options) as any;
          
          if (response.status !== '1') {
            throw new NodeApiError(this.getNode(), { message: response.message || 'Failed to get contract ABI' });
          }
          
          result = {
            address,
            abi: JSON.parse(response.result),
          };
          break;
        }

        case 'getContractSource': {
          const address = this.getNodeParameter('address', i) as string;

          const options: any = {
            method: 'GET',
            url: 'https://api.polygonscan.com/api',
            qs: {
              module: 'contract',
              action: 'getsourcecode',
              address,
              apikey: credentials.apiKey,
            },
            json: true,
          };

          const response = await this.helpers.httpRequest(options) as any;
          
          if (response.status !== '1') {
            throw new NodeApiError(this.getNode(), { message: response.message || 'Failed to get contract source code' });
          }
          
          result = {
            address,
            sourceCode: response.result,
          };
          break;
        }

        case 'verifyContract': {
          const address = this.getNodeParameter('address', i) as string;
          const contractSourceCode = this.getNodeParameter('contractSourceCode', i) as string;
          const contractName = this.getNodeParameter('contractName', i) as string;
          const compilerVersion = this.getNodeParameter('compilerVersion', i) as string;

          const options: any = {
            method: 'POST',
            url: 'https://api.polygonscan.com/api',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: {
              module: 'contract',
              action: 'verifysourcecode',
              addresshash: address,
              sourceCode: contractSourceCode,
              contractname: contractName,
              compilerversion: compilerVersion,
              optimizationUsed: '0',
              runs: '200',
              apikey: credentials.apiKey,
            },
            json: true,
          };

          const response = await this.helpers.httpRequest(options) as any;
          
          if (response.status !== '1') {
            throw new NodeApiError(this.getNode(), { message: response.message || 'Failed to verify contract' });
          }
          
          result = {
            address,
            guid: response.result,
            message: 'Contract verification submitted successfully',
          };
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeEventsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('polygonApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getLogs': {
          const fromBlock = this.getNodeParameter('fromBlock', i) as string;
          const toBlock = this.getNodeParameter('toBlock', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const topicsCollection = this.getNodeParameter('topics', i) as any;
          const blockhash = this.getNodeParameter('blockhash', i) as string;

          const topics: string[] = [];
          if (topicsCollection.topic) {
            for (const topicItem of topicsCollection.topic) {
              if (topicItem.value) {
                topics.push(topicItem.value);
              }
            }
          }

          const params: any = {};
          if (blockhash) {
            params.blockHash = blockhash;
          } else {
            params.fromBlock = fromBlock;
            params.toBlock = toBlock;
          }
          
          if (address) {
            params.address = address;
          }
          
          if (topics.length > 0) {
            params.topics = topics;
          }

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getLogs',
            params: [params],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }

        case 'newFilter': {
          const fromBlock = this.getNodeParameter('fromBlock', i) as string;
          const toBlock = this.getNodeParameter('toBlock', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const topicsCollection = this.getNodeParameter('topics', i) as any;

          const topics: string[] = [];
          if (topicsCollection.topic) {
            for (const topicItem of topicsCollection.topic) {
              if (topicItem.value) {
                topics.push(topicItem.value);
              }
            }
          }

          const params: any = {
            fromBlock,
            toBlock,
          };
          
          if (address) {
            params.address = address;
          }
          
          if (topics.length > 0) {
            params.topics = topics;
          }

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_newFilter',
            params: [params],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = { filterId: responseData.result };
          break;
        }

        case 'getFilterChanges': {
          const filterId = this.getNodeParameter('filterId', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getFilterChanges',
            params: [filterId],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }

        case 'getFilterLogs': {
          const filterId = this.getNodeParameter('filterId', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getFilterLogs',
            params: [filterId],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }

        case 'uninstallFilter': {
          const filterId = this.getNodeParameter('filterId', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_uninstallFilter',
            params: [filterId],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `https://polygon-mainnet.g.alchemy.com/v2/${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = { uninstalled: responseData.result };
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
