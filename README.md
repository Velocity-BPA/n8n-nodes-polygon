# n8n-nodes-polygon

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides seamless integration with Polygon blockchain services, offering 6 comprehensive resources for interacting with accounts, transactions, tokens, NFTs, smart contracts, and blockchain events. Build powerful Web3 workflows with support for balance queries, transaction monitoring, token operations, and smart contract interactions.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Polygon](https://img.shields.io/badge/Polygon-8247E5)
![Web3](https://img.shields.io/badge/Web3-Enabled-purple)
![Blockchain](https://img.shields.io/badge/Blockchain-Ready-green)

## Features

- **Multi-Chain Support** - Connect to Polygon mainnet, Mumbai testnet, and other Polygon networks
- **Complete Account Management** - Query balances, transaction history, and account information
- **Token Operations** - Interact with ERC-20 tokens, check balances, and monitor transfers
- **NFT Integration** - Retrieve NFT metadata, ownership details, and collection information
- **Smart Contract Interaction** - Call contract methods, monitor events, and execute transactions
- **Real-time Event Monitoring** - Subscribe to blockchain events and contract logs
- **Transaction Management** - Send transactions, check status, and retrieve detailed transaction data
- **Gas Optimization** - Automatic gas estimation and fee optimization for transactions

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
| API Key | Your Polygon API key from Alchemy, Infura, or Moralis | Yes |
| Network | Target network (mainnet, mumbai, testnet) | Yes |
| RPC URL | Custom RPC endpoint URL (optional if using standard providers) | No |
| Private Key | Wallet private key for transaction signing (encrypted) | No |

## Resources & Operations

### 1. Accounts

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve native MATIC balance for an address |
| Get Transaction History | Fetch transaction history for an account |
| Get Account Info | Get detailed account information including nonce |
| Validate Address | Verify if an address is valid Ethereum format |

### 2. Transactions

| Operation | Description |
|-----------|-------------|
| Get Transaction | Retrieve transaction details by hash |
| Send Transaction | Send a new transaction to the network |
| Get Transaction Receipt | Get transaction receipt and status |
| Estimate Gas | Estimate gas required for a transaction |
| Get Block | Retrieve block information by number or hash |

### 3. Tokens

| Operation | Description |
|-----------|-------------|
| Get Token Balance | Check ERC-20 token balance for an address |
| Get Token Info | Retrieve token metadata (name, symbol, decimals) |
| Transfer Token | Send ERC-20 tokens to another address |
| Get Token Transfers | Fetch token transfer history |
| Approve Token | Approve token spending allowance |

### 4. NFTs

| Operation | Description |
|-----------|-------------|
| Get NFT Metadata | Retrieve NFT metadata and attributes |
| Get Owner | Check NFT ownership details |
| Get Collection | Fetch NFT collection information |
| Transfer NFT | Transfer NFT to another address |
| Get User NFTs | List all NFTs owned by an address |

### 5. Smart Contracts

| Operation | Description |
|-----------|-------------|
| Call Function | Execute read-only contract function |
| Send Transaction | Execute state-changing contract function |
| Get Contract Info | Retrieve contract ABI and verification status |
| Deploy Contract | Deploy new smart contract to network |
| Get Logs | Fetch contract event logs |

### 6. Events

| Operation | Description |
|-----------|-------------|
| Get Logs | Retrieve blockchain event logs by filter |
| Subscribe to Events | Monitor real-time contract events |
| Get Block Events | Fetch all events from a specific block |
| Filter Events | Apply custom filters to event queries |

## Usage Examples

```javascript
// Get MATIC balance for an address
{
  "resource": "accounts",
  "operation": "getBalance",
  "address": "0x1234567890123456789012345678901234567890"
}
```

```javascript
// Get ERC-20 token balance
{
  "resource": "tokens",
  "operation": "getTokenBalance",
  "address": "0x1234567890123456789012345678901234567890",
  "tokenAddress": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
}
```

```javascript
// Send MATIC transaction
{
  "resource": "transactions",
  "operation": "sendTransaction",
  "to": "0x1234567890123456789012345678901234567890",
  "value": "1000000000000000000",
  "gasLimit": "21000"
}
```

```javascript
// Get NFT metadata
{
  "resource": "nfts",
  "operation": "getNftMetadata",
  "contractAddress": "0x1234567890123456789012345678901234567890",
  "tokenId": "1"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and has sufficient permissions |
| Insufficient Funds | Account balance too low for transaction | Check account balance and add funds if needed |
| Gas Limit Too Low | Transaction failed due to insufficient gas | Increase gas limit or use gas estimation |
| Invalid Address | Provided address format is incorrect | Ensure address is valid Ethereum format (0x...) |
| Network Error | Connection to Polygon network failed | Check network status and RPC endpoint |
| Rate Limit Exceeded | Too many API requests in time window | Implement request throttling or upgrade API plan |

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
- **Polygon Documentation**: [Polygon Developer Docs](https://docs.polygon.technology/)
- **Polygon Community**: [Polygon Discord](https://discord.gg/polygon)