/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Common Contract ABIs
 */

export const ERC20_ABI = [
	'function name() view returns (string)',
	'function symbol() view returns (string)',
	'function decimals() view returns (uint8)',
	'function totalSupply() view returns (uint256)',
	'function balanceOf(address owner) view returns (uint256)',
	'function transfer(address to, uint256 amount) returns (bool)',
	'function allowance(address owner, address spender) view returns (uint256)',
	'function approve(address spender, uint256 amount) returns (bool)',
	'function transferFrom(address from, address to, uint256 amount) returns (bool)',
	'event Transfer(address indexed from, address indexed to, uint256 value)',
	'event Approval(address indexed owner, address indexed spender, uint256 value)',
];

export const ERC721_ABI = [
	'function name() view returns (string)',
	'function symbol() view returns (string)',
	'function tokenURI(uint256 tokenId) view returns (string)',
	'function balanceOf(address owner) view returns (uint256)',
	'function ownerOf(uint256 tokenId) view returns (address)',
	'function safeTransferFrom(address from, address to, uint256 tokenId)',
	'function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)',
	'function transferFrom(address from, address to, uint256 tokenId)',
	'function approve(address to, uint256 tokenId)',
	'function setApprovalForAll(address operator, bool approved)',
	'function getApproved(uint256 tokenId) view returns (address)',
	'function isApprovedForAll(address owner, address operator) view returns (bool)',
	'function totalSupply() view returns (uint256)',
	'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
	'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
	'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',
];

export const ERC1155_ABI = [
	'function uri(uint256 id) view returns (string)',
	'function balanceOf(address account, uint256 id) view returns (uint256)',
	'function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])',
	'function setApprovalForAll(address operator, bool approved)',
	'function isApprovedForAll(address account, address operator) view returns (bool)',
	'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)',
	'function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data)',
	'event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)',
	'event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)',
	'event ApprovalForAll(address indexed account, address indexed operator, bool approved)',
	'event URI(string value, uint256 indexed id)',
];

export const MULTICALL3_ABI = [
	'function aggregate(tuple(address target, bytes callData)[] calls) payable returns (uint256 blockNumber, bytes[] returnData)',
	'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[] returnData)',
	'function aggregate3Value(tuple(address target, bool allowFailure, uint256 value, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[] returnData)',
	'function blockAndAggregate(tuple(address target, bytes callData)[] calls) payable returns (uint256 blockNumber, bytes32 blockHash, tuple(bool success, bytes returnData)[] returnData)',
	'function getBasefee() view returns (uint256 basefee)',
	'function getBlockHash(uint256 blockNumber) view returns (bytes32 blockHash)',
	'function getBlockNumber() view returns (uint256 blockNumber)',
	'function getChainId() view returns (uint256 chainid)',
	'function getCurrentBlockCoinbase() view returns (address coinbase)',
	'function getCurrentBlockDifficulty() view returns (uint256 difficulty)',
	'function getCurrentBlockGasLimit() view returns (uint256 gaslimit)',
	'function getCurrentBlockTimestamp() view returns (uint256 timestamp)',
	'function getEthBalance(address addr) view returns (uint256 balance)',
	'function getLastBlockHash() view returns (bytes32 blockHash)',
	'function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[] returnData)',
	'function tryBlockAndAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) payable returns (uint256 blockNumber, bytes32 blockHash, tuple(bool success, bytes returnData)[] returnData)',
];
