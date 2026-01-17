/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IDataObject,
} from 'n8n-workflow';
import { Contract, formatEther, formatUnits, parseEther } from 'ethers';
import { createProvider } from './transport/provider';
import { createExplorerClient, getTransactionList, getTokenTransfers, getNftTransfers, getContractAbi, getContractSource } from './transport/explorerApi';
import { ERC20_ABI, ERC721_ABI } from './constants/abis';
import { NETWORKS } from './constants/networks';
import { validateAddress, checksumAddress } from './utils/addressUtils';
import { weiToGwei } from './utils/unitConverter';
import { estimateGas, formatGasEstimate } from './utils/gasEstimator';
import { createInterface } from './utils/abiEncoder';

// Runtime licensing notice - logged once per node load
const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;

let licensingNoticeLogged = false;

function logLicensingNotice(): void {
	if (!licensingNoticeLogged) {
		console.warn(LICENSING_NOTICE);
		licensingNoticeLogged = true;
	}
}

export class Polygon implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Polygon',
		name: 'polygon',
		icon: 'file:polygon.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Polygon blockchain (PoS and zkEVM)',
		defaults: {
			name: 'Polygon',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'polygonRpc',
				required: true,
			},
			{
				name: 'polygonScan',
				required: false,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Block', value: 'block' },
					{ name: 'Contract', value: 'contract' },
					{ name: 'NFT', value: 'nft' },
					{ name: 'Token', value: 'token' },
					{ name: 'Transaction', value: 'transaction' },
					{ name: 'Utility', value: 'utility' },
				],
				default: 'account',
			},
			// Account Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['account'] } },
				options: [
					{ name: 'Get Balance', value: 'getBalance', description: 'Get MATIC balance', action: 'Get balance' },
					{ name: 'Get Token Balance', value: 'getTokenBalance', description: 'Get ERC-20 token balance', action: 'Get token balance' },
					{ name: 'Get Transactions', value: 'getTransactions', description: 'Get transaction history', action: 'Get transactions' },
					{ name: 'Get Token Transfers', value: 'getTokenTransfers', description: 'Get ERC-20 transfer history', action: 'Get token transfers' },
					{ name: 'Get NFTs', value: 'getNfts', description: 'Get NFT holdings', action: 'Get NFTs' },
					{ name: 'Validate Address', value: 'validateAddress', description: 'Validate and checksum an address', action: 'Validate address' },
				],
				default: 'getBalance',
			},
			// Block Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['block'] } },
				options: [
					{ name: 'Get Block', value: 'getBlock', description: 'Get block by number or hash', action: 'Get block' },
					{ name: 'Get Latest Block', value: 'getLatestBlock', description: 'Get latest block', action: 'Get latest block' },
					{ name: 'Get Block Transactions', value: 'getBlockTransactions', description: 'Get transactions in a block', action: 'Get block transactions' },
				],
				default: 'getLatestBlock',
			},
			// Contract Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['contract'] } },
				options: [
					{ name: 'Read Contract', value: 'readContract', description: 'Call a view/pure function', action: 'Read contract' },
					{ name: 'Get ABI', value: 'getAbi', description: 'Get contract ABI from explorer', action: 'Get ABI' },
					{ name: 'Get Source Code', value: 'getSourceCode', description: 'Get contract source code', action: 'Get source code' },
				],
				default: 'readContract',
			},
			// Token Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['token'] } },
				options: [
					{ name: 'Get Token Info', value: 'getTokenInfo', description: 'Get token name, symbol, decimals', action: 'Get token info' },
					{ name: 'Get Token Supply', value: 'getTokenSupply', description: 'Get total supply', action: 'Get token supply' },
				],
				default: 'getTokenInfo',
			},
			// Transaction Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['transaction'] } },
				options: [
					{ name: 'Get Transaction', value: 'getTransaction', description: 'Get transaction by hash', action: 'Get transaction' },
					{ name: 'Get Receipt', value: 'getReceipt', description: 'Get transaction receipt', action: 'Get receipt' },
					{ name: 'Estimate Gas', value: 'estimateGas', description: 'Estimate gas for transaction', action: 'Estimate gas' },
				],
				default: 'getTransaction',
			},
			// NFT Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['nft'] } },
				options: [
					{ name: 'Get NFT Metadata', value: 'getNftMetadata', description: 'Get NFT metadata from tokenURI', action: 'Get NFT metadata' },
					{ name: 'Get NFT Owner', value: 'getNftOwner', description: 'Get owner of an NFT', action: 'Get NFT owner' },
					{ name: 'Get Collection Info', value: 'getCollectionInfo', description: 'Get NFT collection info', action: 'Get collection info' },
				],
				default: 'getNftMetadata',
			},
			// Utility Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['utility'] } },
				options: [
					{ name: 'Get Gas Price', value: 'getGasPrice', description: 'Get current gas prices', action: 'Get gas price' },
					{ name: 'Get Chain ID', value: 'getChainId', description: 'Get network chain ID', action: 'Get chain ID' },
					{ name: 'Get Network Info', value: 'getNetworkInfo', description: 'Get network information', action: 'Get network info' },
				],
				default: 'getGasPrice',
			},
			// Common Fields
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['account'],
						operation: ['getBalance', 'getTokenBalance', 'getTransactions', 'getTokenTransfers', 'getNfts', 'validateAddress'],
					},
				},
				placeholder: '0x...',
				description: 'Ethereum address',
			},
			{
				displayName: 'Contract Address',
				name: 'contractAddress',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['account'],
						operation: ['getTokenBalance'],
					},
				},
				placeholder: '0x...',
				description: 'Token contract address',
			},
			{
				displayName: 'Contract Address',
				name: 'contractAddress',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['readContract', 'getAbi', 'getSourceCode'],
					},
				},
				placeholder: '0x...',
				description: 'Smart contract address',
			},
			{
				displayName: 'Contract Address',
				name: 'contractAddress',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['token'],
						operation: ['getTokenInfo', 'getTokenSupply'],
					},
				},
				placeholder: '0x...',
				description: 'Token contract address',
			},
			{
				displayName: 'Contract Address',
				name: 'contractAddress',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['nft'],
						operation: ['getNftMetadata', 'getNftOwner', 'getCollectionInfo'],
					},
				},
				placeholder: '0x...',
				description: 'NFT contract address',
			},
			{
				displayName: 'Token ID',
				name: 'tokenId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['nft'],
						operation: ['getNftMetadata', 'getNftOwner'],
					},
				},
				description: 'NFT token ID',
			},
			{
				displayName: 'Transaction Hash',
				name: 'transactionHash',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['getTransaction', 'getReceipt'],
					},
				},
				placeholder: '0x...',
				description: 'Transaction hash',
			},
			{
				displayName: 'Block Number',
				name: 'blockNumber',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['block'],
						operation: ['getBlock', 'getBlockTransactions'],
					},
				},
				description: 'Block number (0 for latest)',
			},
			{
				displayName: 'Function Name',
				name: 'functionName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['readContract'],
					},
				},
				placeholder: 'balanceOf',
				description: 'Contract function name',
			},
			{
				displayName: 'Function Arguments',
				name: 'functionArgs',
				type: 'string',
				default: '[]',
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['readContract'],
					},
				},
				placeholder: '["0x..."]',
				description: 'Function arguments as JSON array',
			},
			{
				displayName: 'ABI',
				name: 'abi',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['readContract'],
					},
				},
				placeholder: '[{"name":"balanceOf",...}]',
				description: 'Contract ABI (JSON). Leave empty to fetch from explorer.',
			},
			{
				displayName: 'To Address',
				name: 'toAddress',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['estimateGas'],
					},
				},
				placeholder: '0x...',
				description: 'Destination address',
			},
			{
				displayName: 'Value (MATIC)',
				name: 'value',
				type: 'string',
				default: '0',
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['estimateGas'],
					},
				},
				description: 'Amount of MATIC to send',
			},
			{
				displayName: 'Data',
				name: 'data',
				type: 'string',
				default: '0x',
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['estimateGas'],
					},
				},
				description: 'Transaction data (hex)',
			},
			// Pagination options
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['account'],
						operation: ['getTransactions', 'getTokenTransfers', 'getNfts'],
					},
				},
				options: [
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 1,
						description: 'Page number',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 10,
						description: 'Results per page',
					},
					{
						displayName: 'Sort',
						name: 'sort',
						type: 'options',
						options: [
							{ name: 'Descending', value: 'desc' },
							{ name: 'Ascending', value: 'asc' },
						],
						default: 'desc',
						description: 'Sort order',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Log licensing notice once per node load
		logLicensingNotice();

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('polygonRpc');
		const connection = createProvider(credentials);
		const { provider, network } = connection;

		let explorerClient;
		try {
			const explorerCredentials = await this.getCredentials('polygonScan');
			explorerClient = createExplorerClient(explorerCredentials);
		} catch {
			// Explorer credentials not provided, some operations may not work
		}

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: IDataObject = {};

				switch (resource) {
					case 'account':
						result = await executeAccountOperation(this, provider, explorerClient, network, operation, i);
						break;
					case 'block':
						result = await executeBlockOperation(this, provider, operation, i);
						break;
					case 'contract':
						result = await executeContractOperation(this, provider, explorerClient, operation, i);
						break;
					case 'token':
						result = await executeTokenOperation(this, provider, operation, i);
						break;
					case 'transaction':
						result = await executeTransactionOperation(this, provider, operation, i);
						break;
					case 'nft':
						result = await executeNftOperation(this, provider, operation, i);
						break;
					case 'utility':
						result = await executeUtilityOperation(this, provider, network, operation, i);
						break;
					default:
						throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
				}

				returnData.push({ json: result });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } as IDataObject });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

async function executeAccountOperation(
	context: IExecuteFunctions,
	provider: import('ethers').JsonRpcProvider,
	explorerClient: ReturnType<typeof createExplorerClient> | undefined,
	network: string,
	operation: string,
	itemIndex: number
): Promise<IDataObject> {
	const address = context.getNodeParameter('address', itemIndex) as string;
	
	if (!validateAddress(address)) {
		throw new Error(`Invalid address: ${address}`);
	}

	switch (operation) {
		case 'getBalance': {
			const balance = await provider.getBalance(address);
			const networkConfig = NETWORKS[network];
			return {
				address: checksumAddress(address),
				balance: formatEther(balance),
				balanceWei: balance.toString(),
				symbol: networkConfig?.currency.symbol || 'MATIC',
				network,
			};
		}
		case 'getTokenBalance': {
			const contractAddress = context.getNodeParameter('contractAddress', itemIndex) as string;
			const contract = new Contract(contractAddress, ERC20_ABI, provider);
			const [balance, decimals, symbol] = await Promise.all([
				contract.balanceOf(address),
				contract.decimals(),
				contract.symbol(),
			]);
			return {
				address: checksumAddress(address),
				tokenAddress: checksumAddress(contractAddress),
				balance: formatUnits(balance, decimals),
				balanceRaw: balance.toString(),
				decimals: Number(decimals),
				symbol,
			};
		}
		case 'getTransactions': {
			if (!explorerClient) throw new Error('PolygonScan credentials required');
			const options = context.getNodeParameter('options', itemIndex, {}) as IDataObject;
			const transactions = await getTransactionList(explorerClient, address, {
				page: options.page as number,
				offset: options.limit as number,
				sort: options.sort as 'asc' | 'desc',
			});
			return { address: checksumAddress(address), transactions, count: transactions.length };
		}
		case 'getTokenTransfers': {
			if (!explorerClient) throw new Error('PolygonScan credentials required');
			const options = context.getNodeParameter('options', itemIndex, {}) as IDataObject;
			const transfers = await getTokenTransfers(explorerClient, address, {
				page: options.page as number,
				offset: options.limit as number,
				sort: options.sort as 'asc' | 'desc',
			});
			return { address: checksumAddress(address), transfers, count: transfers.length };
		}
		case 'getNfts': {
			if (!explorerClient) throw new Error('PolygonScan credentials required');
			const options = context.getNodeParameter('options', itemIndex, {}) as IDataObject;
			const nfts = await getNftTransfers(explorerClient, address, {
				page: options.page as number,
				offset: options.limit as number,
				sort: options.sort as 'asc' | 'desc',
			});
			return { address: checksumAddress(address), nfts, count: nfts.length };
		}
		case 'validateAddress': {
			const isValid = validateAddress(address);
			return {
				address,
				isValid,
				checksumAddress: isValid ? checksumAddress(address) : null,
			};
		}
		default:
			throw new Error(`Unknown account operation: ${operation}`);
	}
}

async function executeBlockOperation(
	context: IExecuteFunctions,
	provider: import('ethers').JsonRpcProvider,
	operation: string,
	itemIndex: number
): Promise<IDataObject> {
	switch (operation) {
		case 'getBlock': {
			const blockNumber = context.getNodeParameter('blockNumber', itemIndex) as number;
			const block = await provider.getBlock(blockNumber || 'latest');
			if (!block) throw new Error('Block not found');
			return {
				number: block.number,
				hash: block.hash,
				parentHash: block.parentHash,
				timestamp: block.timestamp,
				nonce: block.nonce,
				difficulty: block.difficulty?.toString(),
				gasLimit: block.gasLimit.toString(),
				gasUsed: block.gasUsed.toString(),
				miner: block.miner,
				transactionCount: block.transactions.length,
			};
		}
		case 'getLatestBlock': {
			const block = await provider.getBlock('latest');
			if (!block) throw new Error('Block not found');
			return {
				number: block.number,
				hash: block.hash,
				timestamp: block.timestamp,
				gasUsed: block.gasUsed.toString(),
				gasLimit: block.gasLimit.toString(),
				transactionCount: block.transactions.length,
			};
		}
		case 'getBlockTransactions': {
			const blockNumber = context.getNodeParameter('blockNumber', itemIndex) as number;
			const block = await provider.getBlock(blockNumber || 'latest', true);
			if (!block) throw new Error('Block not found');
			return {
				blockNumber: block.number,
				transactionCount: block.transactions.length,
				transactions: block.transactions,
			};
		}
		default:
			throw new Error(`Unknown block operation: ${operation}`);
	}
}

async function executeContractOperation(
	context: IExecuteFunctions,
	provider: import('ethers').JsonRpcProvider,
	explorerClient: ReturnType<typeof createExplorerClient> | undefined,
	operation: string,
	itemIndex: number
): Promise<IDataObject> {
	const contractAddress = context.getNodeParameter('contractAddress', itemIndex) as string;

	switch (operation) {
		case 'readContract': {
			const functionName = context.getNodeParameter('functionName', itemIndex) as string;
			const functionArgsStr = context.getNodeParameter('functionArgs', itemIndex) as string;
			let abiStr = context.getNodeParameter('abi', itemIndex) as string;
			
			const functionArgs = JSON.parse(functionArgsStr || '[]');
			
			if (!abiStr && explorerClient) {
				abiStr = await getContractAbi(explorerClient, contractAddress);
			}
			
			if (!abiStr) throw new Error('ABI required. Provide ABI or add PolygonScan credentials.');
			
			const iface = createInterface(abiStr);
			const contract = new Contract(contractAddress, iface, provider);
			const result = await contract[functionName](...functionArgs);
			
			return {
				contractAddress: checksumAddress(contractAddress),
				functionName,
				result: typeof result === 'bigint' ? result.toString() : result,
			};
		}
		case 'getAbi': {
			if (!explorerClient) throw new Error('PolygonScan credentials required');
			const abi = await getContractAbi(explorerClient, contractAddress);
			return {
				contractAddress: checksumAddress(contractAddress),
				abi: JSON.parse(abi),
			};
		}
		case 'getSourceCode': {
			if (!explorerClient) throw new Error('PolygonScan credentials required');
			const source = await getContractSource(explorerClient, contractAddress);
			return {
				contractAddress: checksumAddress(contractAddress),
				source,
			};
		}
		default:
			throw new Error(`Unknown contract operation: ${operation}`);
	}
}

async function executeTokenOperation(
	context: IExecuteFunctions,
	provider: import('ethers').JsonRpcProvider,
	operation: string,
	itemIndex: number
): Promise<IDataObject> {
	const contractAddress = context.getNodeParameter('contractAddress', itemIndex) as string;
	const contract = new Contract(contractAddress, ERC20_ABI, provider);

	switch (operation) {
		case 'getTokenInfo': {
			const [name, symbol, decimals, totalSupply] = await Promise.all([
				contract.name(),
				contract.symbol(),
				contract.decimals(),
				contract.totalSupply(),
			]);
			return {
				address: checksumAddress(contractAddress),
				name,
				symbol,
				decimals: Number(decimals),
				totalSupply: formatUnits(totalSupply, decimals),
				totalSupplyRaw: totalSupply.toString(),
			};
		}
		case 'getTokenSupply': {
			const [totalSupply, decimals] = await Promise.all([
				contract.totalSupply(),
				contract.decimals(),
			]);
			return {
				address: checksumAddress(contractAddress),
				totalSupply: formatUnits(totalSupply, decimals),
				totalSupplyRaw: totalSupply.toString(),
				decimals: Number(decimals),
			};
		}
		default:
			throw new Error(`Unknown token operation: ${operation}`);
	}
}

async function executeTransactionOperation(
	context: IExecuteFunctions,
	provider: import('ethers').JsonRpcProvider,
	operation: string,
	itemIndex: number
): Promise<IDataObject> {
	switch (operation) {
		case 'getTransaction': {
			const txHash = context.getNodeParameter('transactionHash', itemIndex) as string;
			const tx = await provider.getTransaction(txHash);
			if (!tx) throw new Error('Transaction not found');
			return {
				hash: tx.hash,
				from: tx.from,
				to: tx.to,
				value: formatEther(tx.value),
				valueWei: tx.value.toString(),
				gasPrice: tx.gasPrice?.toString(),
				gasLimit: tx.gasLimit.toString(),
				nonce: tx.nonce,
				data: tx.data,
				blockNumber: tx.blockNumber,
				blockHash: tx.blockHash,
			};
		}
		case 'getReceipt': {
			const txHash = context.getNodeParameter('transactionHash', itemIndex) as string;
			const receipt = await provider.getTransactionReceipt(txHash);
			if (!receipt) throw new Error('Receipt not found');
			return {
				transactionHash: receipt.hash,
				blockNumber: receipt.blockNumber,
				blockHash: receipt.blockHash,
				from: receipt.from,
				to: receipt.to,
				status: receipt.status === 1 ? 'success' : 'failed',
				gasUsed: receipt.gasUsed.toString(),
				cumulativeGasUsed: receipt.cumulativeGasUsed.toString(),
				logs: receipt.logs.map(log => ({
					address: log.address,
					topics: log.topics,
					data: log.data,
				})),
			};
		}
		case 'estimateGas': {
			const toAddress = context.getNodeParameter('toAddress', itemIndex) as string;
			const value = context.getNodeParameter('value', itemIndex) as string;
			const data = context.getNodeParameter('data', itemIndex) as string;
			
			const estimate = await estimateGas(provider, {
				to: toAddress || undefined,
				value: value ? parseEther(value) : undefined,
				data: data || '0x',
			});
			
			return formatGasEstimate(estimate) as IDataObject;
		}
		default:
			throw new Error(`Unknown transaction operation: ${operation}`);
	}
}

async function executeNftOperation(
	context: IExecuteFunctions,
	provider: import('ethers').JsonRpcProvider,
	operation: string,
	itemIndex: number
): Promise<IDataObject> {
	const contractAddress = context.getNodeParameter('contractAddress', itemIndex) as string;

	switch (operation) {
		case 'getNftMetadata': {
			const tokenId = context.getNodeParameter('tokenId', itemIndex) as string;
			const contract = new Contract(contractAddress, ERC721_ABI, provider);
			const tokenUri = await contract.tokenURI(tokenId);
			return {
				contractAddress: checksumAddress(contractAddress),
				tokenId,
				tokenUri,
			};
		}
		case 'getNftOwner': {
			const tokenId = context.getNodeParameter('tokenId', itemIndex) as string;
			const contract = new Contract(contractAddress, ERC721_ABI, provider);
			const owner = await contract.ownerOf(tokenId);
			return {
				contractAddress: checksumAddress(contractAddress),
				tokenId,
				owner,
			};
		}
		case 'getCollectionInfo': {
			const contract = new Contract(contractAddress, ERC721_ABI, provider);
			let totalSupply = 'N/A';
			try {
				totalSupply = (await contract.totalSupply()).toString();
			} catch {
				// totalSupply may not be implemented
			}
			const [name, symbol] = await Promise.all([
				contract.name(),
				contract.symbol(),
			]);
			return {
				contractAddress: checksumAddress(contractAddress),
				name,
				symbol,
				totalSupply,
			};
		}
		default:
			throw new Error(`Unknown NFT operation: ${operation}`);
	}
}

async function executeUtilityOperation(
	context: IExecuteFunctions,
	provider: import('ethers').JsonRpcProvider,
	network: string,
	operation: string,
	itemIndex: number
): Promise<IDataObject> {
	switch (operation) {
		case 'getGasPrice': {
			const feeData = await provider.getFeeData();
			return {
				gasPrice: feeData.gasPrice?.toString(),
				gasPriceGwei: feeData.gasPrice ? weiToGwei(feeData.gasPrice) : null,
				maxFeePerGas: feeData.maxFeePerGas?.toString(),
				maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
			};
		}
		case 'getChainId': {
			const networkInfo = await provider.getNetwork();
			return {
				chainId: Number(networkInfo.chainId),
				name: networkInfo.name,
			};
		}
		case 'getNetworkInfo': {
			const networkConfig = NETWORKS[network];
			const [blockNumber, feeData] = await Promise.all([
				provider.getBlockNumber(),
				provider.getFeeData(),
			]);
			return {
				network,
				chainId: networkConfig?.chainId,
				name: networkConfig?.name,
				currency: networkConfig?.currency,
				latestBlock: blockNumber,
				gasPrice: feeData.gasPrice?.toString(),
				isTestnet: networkConfig?.isTestnet,
			};
		}
		default:
			throw new Error(`Unknown utility operation: ${operation}`);
	}
}
