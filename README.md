# n8n-nodes-polygon

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for interacting with Polygon blockchain networks. This node provides access to 6 key resources including blocks, transactions, accounts, smart contracts, tokens, and network information, enabling seamless integration of Polygon blockchain data into your n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Polygon](https://img.shields.io/badge/Polygon-8247E5-blue)
![Web3](https://img.shields.io/badge/Web3-Ready-blue)
![Blockchain](https://img.shields.io/badge/Blockchain-API-blue)

## Features

- **Block Operations** - Retrieve block data, transactions, and metadata from Polygon blockchain
- **Transaction Management** - Query transaction details, receipts, and status information
- **Account Monitoring** - Access account balances, transaction history, and account information
- **Smart Contract Integration** - Interact with smart contracts, call functions, and monitor events
- **Token Operations** - Handle ERC-20/ERC-721 tokens, balances, transfers, and metadata
- **Network Information** - Access network statistics, gas prices, and chain information
- **Multi-Network Support** - Works with Polygon mainnet, Mumbai testnet, and custom networks
- **Real-time Data** - Get latest blockchain data with high-performance API integration

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-polygon`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-polygon
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-polygon.git
cd n8n-nodes-polygon
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-polygon
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Polygon API key for accessing blockchain data | Yes |
| Network | Target network (mainnet, mumbai, custom) | Yes |
| RPC URL | Custom RPC endpoint (if using custom network) | No |

## Resources & Operations

### 1. Block

| Operation | Description |
|-----------|-------------|
| Get Block | Retrieve block information by block number or hash |
| Get Latest Block | Get the most recent block on the network |
| Get Block Transactions | List all transactions in a specific block |
| Get Block Range | Retrieve multiple blocks within a specified range |

### 2. Transaction

| Operation | Description |
|-----------|-------------|
| Get Transaction | Retrieve transaction details by transaction hash |
| Get Transaction Receipt | Get transaction receipt and execution details |
| Get Transaction Status | Check transaction confirmation status |
| Send Transaction | Broadcast a signed transaction to the network |
| Estimate Gas | Calculate gas costs for a transaction |

### 3. Account

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve MATIC balance for an account |
| Get Transaction History | List transactions for a specific account |
| Get Account Info | Get detailed account information and metadata |
| Get Nonce | Retrieve the current nonce for an account |

### 4. Smart Contract

| Operation | Description |
|-----------|-------------|
| Call Function | Execute a read-only function on a smart contract |
| Send Transaction | Execute a state-changing function on a contract |
| Get Contract Info | Retrieve contract metadata and ABI information |
| Get Events | Query contract events and logs |
| Verify Contract | Verify contract source code |

### 5. Token

| Operation | Description |
|-----------|-------------|
| Get Token Balance | Retrieve ERC-20 token balance for an account |
| Get Token Info | Get token metadata, name, symbol, and decimals |
| Get Token Transfers | List token transfer events |
| Get NFT Metadata | Retrieve NFT metadata and ownership information |
| Get Token Supply | Get total and circulating token supply |

### 6. Network

| Operation | Description |
|-----------|-------------|
| Get Gas Price | Retrieve current gas prices on the network |
| Get Network Stats | Get network statistics and performance metrics |
| Get Chain Info | Retrieve blockchain configuration and parameters |
| Get Node Info | Get information about connected nodes |

## Usage Examples

```javascript
// Get latest block information
{
  "resource": "block",
  "operation": "getLatestBlock",
  "returnFullTransaction": true
}
```

```javascript
// Check token balance for an account
{
  "resource": "token",
  "operation": "getTokenBalance",
  "accountAddress": "0x742d35Cc6634C0532925a3b8D85B6BfD9C7C0b2F",
  "tokenContract": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  "blockNumber": "latest"
}
```

```javascript
// Call a smart contract function
{
  "resource": "smartContract",
  "operation": "callFunction",
  "contractAddress": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
  "functionName": "balanceOf",
  "parameters": ["0x742d35Cc6634C0532925a3b8D85B6BfD9C7C0b2F"],
  "abi": [...contract_abi...]
}
```

```javascript
// Get transaction details and receipt
{
  "resource": "transaction",
  "operation": "getTransaction",
  "transactionHash": "0x8f4d6e5c3b2a1f9e8d7c6b5a4f3e2d1c9b8a7f6e5d4c3b2a1f9e8d7c6b5a4f3e",
  "includeReceipt": true
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and has proper permissions |
| Rate Limit Exceeded | Too many requests sent to the API | Implement delays between requests or upgrade API plan |
| Invalid Address | Blockchain address format is incorrect | Ensure address follows proper Ethereum/Polygon format (0x...) |
| Transaction Not Found | Specified transaction hash does not exist | Verify transaction hash and ensure it's on the correct network |
| Network Timeout | Request timed out waiting for response | Check network connection and try again |
| Insufficient Funds | Account lacks sufficient balance for transaction | Ensure account has enough MATIC for gas fees |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-polygon/issues)
- **Polygon Documentation**: [docs.polygon.technology](https://docs.polygon.technology)
- **Developer Portal**: [polygon.technology/developers](https://polygon.technology/developers)