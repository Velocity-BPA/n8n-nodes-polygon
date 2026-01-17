/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IPollFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { Contract, formatEther, formatUnits } from 'ethers';
import { createProvider } from './transport/provider';
import { ERC20_ABI, ERC721_ABI } from './constants/abis';
import { NETWORKS } from './constants/networks';
import { checksumAddress, validateAddress } from './utils/addressUtils';

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

export class PolygonTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Polygon Trigger',
		name: 'polygonTrigger',
		icon: 'file:polygon.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Triggers on Polygon blockchain events',
		defaults: {
			name: 'Polygon Trigger',
		},
		polling: true,
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'polygonRpc',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'New Block',
						value: 'newBlock',
						description: 'Trigger on new blocks',
					},
					{
						name: 'MATIC Transfer',
						value: 'maticTransfer',
						description: 'Trigger on native MATIC transfers to/from an address',
					},
					{
						name: 'Token Transfer',
						value: 'tokenTransfer',
						description: 'Trigger on ERC-20 token transfers',
					},
					{
						name: 'NFT Transfer',
						value: 'nftTransfer',
						description: 'Trigger on NFT (ERC-721) transfers',
					},
				],
				default: 'newBlock',
				description: 'The event to listen for',
			},
			{
				displayName: 'Watch Address',
				name: 'watchAddress',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						event: ['maticTransfer', 'tokenTransfer', 'nftTransfer'],
					},
				},
				placeholder: '0x...',
				description: 'Address to monitor for transfers',
			},
			{
				displayName: 'Token Contract',
				name: 'tokenContract',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						event: ['tokenTransfer'],
					},
				},
				placeholder: '0x...',
				description: 'Token contract address (leave empty for all tokens)',
			},
			{
				displayName: 'NFT Contract',
				name: 'nftContract',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						event: ['nftTransfer'],
					},
				},
				placeholder: '0x...',
				description: 'NFT contract address (leave empty for all NFTs)',
			},
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options',
				options: [
					{ name: 'Both', value: 'both' },
					{ name: 'Incoming Only', value: 'incoming' },
					{ name: 'Outgoing Only', value: 'outgoing' },
				],
				default: 'both',
				displayOptions: {
					show: {
						event: ['maticTransfer', 'tokenTransfer', 'nftTransfer'],
					},
				},
				description: 'Filter by transfer direction',
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		// Log licensing notice once per node load
		logLicensingNotice();

		const credentials = await this.getCredentials('polygonRpc');
		const connection = createProvider(credentials);
		const { provider, network } = connection;
		
		const event = this.getNodeParameter('event') as string;
		const webhookData = this.getWorkflowStaticData('node');
		
		const currentBlock = await provider.getBlockNumber();
		const lastProcessedBlock = (webhookData.lastProcessedBlock as number) || currentBlock - 1;
		
		if (currentBlock <= lastProcessedBlock) {
			return null;
		}
		
		const returnData: INodeExecutionData[] = [];
		
		switch (event) {
			case 'newBlock': {
				for (let blockNum = lastProcessedBlock + 1; blockNum <= currentBlock; blockNum++) {
					const block = await provider.getBlock(blockNum);
					if (block) {
						returnData.push({
							json: {
								blockNumber: block.number,
								hash: block.hash,
								timestamp: block.timestamp,
								transactionCount: block.transactions.length,
								gasUsed: block.gasUsed.toString(),
								gasLimit: block.gasLimit.toString(),
								network,
							},
						});
					}
				}
				break;
			}
			
			case 'maticTransfer': {
				const watchAddress = this.getNodeParameter('watchAddress') as string;
				const direction = this.getNodeParameter('direction') as string;
				
				if (!validateAddress(watchAddress)) {
					throw new Error(`Invalid watch address: ${watchAddress}`);
				}
				
				const checksummed = checksumAddress(watchAddress).toLowerCase();
				
				for (let blockNum = lastProcessedBlock + 1; blockNum <= currentBlock; blockNum++) {
					const block = await provider.getBlock(blockNum, true);
					if (!block || !block.prefetchedTransactions) continue;
					
					for (const tx of block.prefetchedTransactions) {
						if (tx.value === BigInt(0)) continue;
						
						const isIncoming = tx.to?.toLowerCase() === checksummed;
						const isOutgoing = tx.from.toLowerCase() === checksummed;
						
						if (direction === 'incoming' && !isIncoming) continue;
						if (direction === 'outgoing' && !isOutgoing) continue;
						if (!isIncoming && !isOutgoing) continue;
						
						returnData.push({
							json: {
								type: isIncoming ? 'incoming' : 'outgoing',
								hash: tx.hash,
								from: tx.from,
								to: tx.to,
								value: formatEther(tx.value),
								valueWei: tx.value.toString(),
								blockNumber: blockNum,
								network,
							},
						});
					}
				}
				break;
			}
			
			case 'tokenTransfer': {
				const watchAddress = this.getNodeParameter('watchAddress') as string;
				const tokenContract = this.getNodeParameter('tokenContract') as string;
				const direction = this.getNodeParameter('direction') as string;
				
				if (!validateAddress(watchAddress)) {
					throw new Error(`Invalid watch address: ${watchAddress}`);
				}
				
				const checksummed = checksumAddress(watchAddress).toLowerCase();
				
				// Transfer event topic
				const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
				
				const filter: Record<string, unknown> = {
					topics: [transferTopic],
					fromBlock: lastProcessedBlock + 1,
					toBlock: currentBlock,
				};
				
				if (tokenContract && validateAddress(tokenContract)) {
					filter.address = checksumAddress(tokenContract);
				}
				
				const logs = await provider.getLogs(filter);
				
				for (const log of logs) {
					if (log.topics.length < 3) continue;
					
					const from = '0x' + log.topics[1].slice(26).toLowerCase();
					const to = '0x' + log.topics[2].slice(26).toLowerCase();
					
					const isIncoming = to === checksummed;
					const isOutgoing = from === checksummed;
					
					if (direction === 'incoming' && !isIncoming) continue;
					if (direction === 'outgoing' && !isOutgoing) continue;
					if (!isIncoming && !isOutgoing) continue;
					
					// Get token info
					let symbol = 'UNKNOWN';
					let decimals = 18;
					try {
						const contract = new Contract(log.address, ERC20_ABI, provider);
						[symbol, decimals] = await Promise.all([
							contract.symbol(),
							contract.decimals(),
						]);
					} catch {
						// Token info not available
					}
					
					const value = BigInt(log.data);
					
					returnData.push({
						json: {
							type: isIncoming ? 'incoming' : 'outgoing',
							tokenAddress: log.address,
							symbol,
							from: checksumAddress('0x' + log.topics[1].slice(26)),
							to: checksumAddress('0x' + log.topics[2].slice(26)),
							value: formatUnits(value, decimals),
							valueRaw: value.toString(),
							blockNumber: log.blockNumber,
							transactionHash: log.transactionHash,
							network,
						},
					});
				}
				break;
			}
			
			case 'nftTransfer': {
				const watchAddress = this.getNodeParameter('watchAddress') as string;
				const nftContract = this.getNodeParameter('nftContract') as string;
				const direction = this.getNodeParameter('direction') as string;
				
				if (!validateAddress(watchAddress)) {
					throw new Error(`Invalid watch address: ${watchAddress}`);
				}
				
				const checksummed = checksumAddress(watchAddress).toLowerCase();
				
				// ERC721 Transfer event topic
				const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
				
				const filter: Record<string, unknown> = {
					topics: [transferTopic],
					fromBlock: lastProcessedBlock + 1,
					toBlock: currentBlock,
				};
				
				if (nftContract && validateAddress(nftContract)) {
					filter.address = checksumAddress(nftContract);
				}
				
				const logs = await provider.getLogs(filter);
				
				for (const log of logs) {
					// ERC721 transfers have 4 topics (including tokenId)
					if (log.topics.length !== 4) continue;
					
					const from = '0x' + log.topics[1].slice(26).toLowerCase();
					const to = '0x' + log.topics[2].slice(26).toLowerCase();
					const tokenId = BigInt(log.topics[3]).toString();
					
					const isIncoming = to === checksummed;
					const isOutgoing = from === checksummed;
					
					if (direction === 'incoming' && !isIncoming) continue;
					if (direction === 'outgoing' && !isOutgoing) continue;
					if (!isIncoming && !isOutgoing) continue;
					
					// Get NFT info
					let name = 'Unknown Collection';
					let symbol = 'NFT';
					try {
						const contract = new Contract(log.address, ERC721_ABI, provider);
						[name, symbol] = await Promise.all([
							contract.name(),
							contract.symbol(),
						]);
					} catch {
						// Collection info not available
					}
					
					returnData.push({
						json: {
							type: isIncoming ? 'incoming' : 'outgoing',
							contractAddress: log.address,
							collectionName: name,
							symbol,
							tokenId,
							from: checksumAddress('0x' + log.topics[1].slice(26)),
							to: checksumAddress('0x' + log.topics[2].slice(26)),
							blockNumber: log.blockNumber,
							transactionHash: log.transactionHash,
							network,
						},
					});
				}
				break;
			}
		}
		
		webhookData.lastProcessedBlock = currentBlock;
		
		if (returnData.length === 0) {
			return null;
		}
		
		return [returnData];
	}
}
