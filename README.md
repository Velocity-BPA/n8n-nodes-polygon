# n8n-nodes-polygon

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for interacting with the **Polygon blockchain** (PoS and zkEVM), providing 7 resource categories and 30+ operations for accounts, transactions, tokens, NFTs, smart contracts, blocks, and real-time event monitoring.

![Polygon](https://img.shields.io/badge/Polygon-8247E5?style=for-the-badge&logo=polygon&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-EA4B71?style=for-the-badge&logo=n8n&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-BSL--1.1-blue?style=for-the-badge)

## Features

- **Multi-Network Support**: Polygon PoS Mainnet, Amoy Testnet, zkEVM Mainnet, Cardona Testnet
- **Complete Account Management**: Balance checks, transaction history, token holdings
- **Smart Contract Interaction**: Read contracts, fetch ABIs, view source code
- **NFT Operations**: Metadata retrieval, ownership verification, collection info
- **Real-Time Monitoring**: Trigger workflows on blocks, transfers, and token events
- **Gas Estimation**: Accurate gas price and transaction cost estimation

## Installation

### Community Nodes (Recommended)

1. Go to **Settings** > **Community Nodes** in n8n
2. Search for `n8n-nodes-polygon`
3. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
mkdir -p custom && cd custom
npm install n8n-nodes-polygon
```

### Development Installation

```bash
# 1. Extract the zip file
unzip n8n-nodes-polygon.zip
cd n8n-nodes-polygon

# 2. Install dependencies
pnpm install

# 3. Build the project
pnpm build

# 4. Create symlink to n8n custom nodes directory
# For Linux/macOS:
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-polygon

# For Windows (run as Administrator):
# mklink /D %USERPROFILE%\.n8n\custom\n8n-nodes-polygon %CD%

# 5. Restart n8n
n8n start
```

## Credentials Setup

### Polygon RPC

| Field | Description |
|-------|-------------|
| Network | Select Polygon network (Mainnet, Amoy, zkEVM, Cardona, Custom) |
| RPC Provider | Choose provider (Alchemy, Infura, QuickNode, Public, Custom) |
| API Key | Your provider API key |
| Private Key | Optional: For write operations (signing transactions) |
| Chain ID | Auto-populated based on network selection |

### PolygonScan API

| Field | Description |
|-------|-------------|
| API Key | Your PolygonScan API key |
| Network | Select matching network |

**Get API Keys:**
- [Alchemy](https://www.alchemy.com/) - Free tier available
- [Infura](https://infura.io/) - Free tier available
- [QuickNode](https://www.quicknode.com/) - Free tier available
- [PolygonScan](https://polygonscan.com/apis) - Free API key

## Resources & Operations

### Account

| Operation | Description |
|-----------|-------------|
| Get Balance | Get native MATIC/ETH balance |
| Get Token Balance | Get ERC-20 token balance |
| Get Transactions | Get transaction history |
| Get Token Transfers | Get ERC-20 transfer history |
| Get NFTs | Get NFT holdings |
| Validate Address | Validate and checksum address |

### Block

| Operation | Description |
|-----------|-------------|
| Get Block | Get block by number |
| Get Latest Block | Get most recent block |
| Get Block Transactions | Get all transactions in a block |

### Contract

| Operation | Description |
|-----------|-------------|
| Read Contract | Call view/pure functions |
| Get ABI | Fetch ABI from explorer |
| Get Source Code | Get verified source code |

### Token

| Operation | Description |
|-----------|-------------|
| Get Token Info | Get name, symbol, decimals |
| Get Token Supply | Get total supply |

### Transaction

| Operation | Description |
|-----------|-------------|
| Get Transaction | Get transaction by hash |
| Get Receipt | Get transaction receipt with logs |
| Estimate Gas | Estimate gas for transaction |

### NFT

| Operation | Description |
|-----------|-------------|
| Get NFT Metadata | Get tokenURI and metadata |
| Get NFT Owner | Get current owner |
| Get Collection Info | Get collection details |

### Utility

| Operation | Description |
|-----------|-------------|
| Get Gas Price | Current gas prices (EIP-1559) |
| Get Chain ID | Network chain ID |
| Get Network Info | Full network details |

## Trigger Node

The **Polygon Trigger** node monitors blockchain events in real-time:

| Event | Description |
|-------|-------------|
| New Block | Trigger on each new block |
| MATIC Transfer | Monitor native token transfers |
| Token Transfer | Monitor ERC-20 transfers |
| NFT Transfer | Monitor ERC-721 transfers |

### Trigger Configuration

- **Watch Address**: Address to monitor
- **Direction**: Incoming, Outgoing, or Both
- **Contract Filter**: Optionally filter by specific token/NFT contract

## Usage Examples

### Get Wallet Balance

```json
{
  "resource": "account",
  "operation": "getBalance",
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f2b8E5"
}
```

### Read Smart Contract

```json
{
  "resource": "contract",
  "operation": "readContract",
  "contractAddress": "0x...",
  "functionName": "balanceOf",
  "functionArgs": "[\"0x...\"]"
}
```

### Monitor Token Transfers

1. Add **Polygon Trigger** node
2. Select "Token Transfer" event
3. Enter watch address
4. Set direction (incoming/outgoing/both)
5. Connect to workflow

## Networks

| Network | Chain ID | Currency | Type |
|---------|----------|----------|------|
| Polygon Mainnet | 137 | MATIC | Production |
| Polygon Amoy | 80002 | MATIC | Testnet |
| Polygon zkEVM | 1101 | ETH | Production |
| zkEVM Cardona | 2442 | ETH | Testnet |

## Error Handling

The node provides descriptive error messages for common issues:

- **Invalid Address**: Address format validation failed
- **Contract Not Verified**: ABI not available on explorer
- **Insufficient Funds**: Not enough balance for transaction
- **RPC Error**: Network connectivity issues

## Security Best Practices

1. **Never commit private keys** to version control
2. **Use environment variables** for sensitive credentials
3. **Test on testnets** before mainnet deployment
4. **Validate addresses** before transactions
5. **Monitor gas prices** to avoid overpaying

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev

# Run tests
pnpm test

# Test with coverage
pnpm test:coverage

# Lint
pnpm lint

# Fix lint issues
pnpm lint:fix
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
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

All contributions must comply with the BSL 1.1 license.

## Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Velocity-BPA/n8n-nodes-polygon/issues)
- **n8n Community**: [community.n8n.io](https://community.n8n.io)

## Acknowledgments

- [Polygon](https://polygon.technology/) - Layer 2 scaling solution
- [ethers.js](https://docs.ethers.org/) - Ethereum library
- [n8n](https://n8n.io/) - Workflow automation platform
- [PolygonScan](https://polygonscan.com/) - Block explorer API

---

Made with ❤️ for the n8n and Polygon communities
