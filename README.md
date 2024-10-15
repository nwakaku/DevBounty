# DevBounty

Incentivizing open-source development on Aptos blockchain.

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Local Development](#local-development)
- [Future Roadmap](#future-roadmap)

## Overview

DevBounty is a platform designed to reward open-source developers for their contributions to Aptos ecosystem projects directly on GitHub. We've streamlined the process of managing and distributing funds on the Aptos blockchain, making it easier for organizations to incentivize development and for contributors to get recognized and rewarded.

## Key Features

1. **Native Aptos Integration**: Our smart contracts are deployed on the Aptos blockchain, leveraging its high throughput and low-cost transactions.

2. **Developer Contributions**: Developers can explore GitHub repositories, pick issues to work on, and earn rewards in APT tokens.

3. **Secure Authentication**: With GitHub login integrated through Petra Wallet, we ensure that only verified users participate, maintaining a secure and trusted environment.

4. **Fund & Reward Management**: Repo owners and pool managers can allocate funds to specific issues. Once resolved, rewards are automatically distributed to the contributor's Aptos wallet.

5. **User Roles**:
   - **Pool Managers**: Manage rewards, add funds, set bounties.
   - **Contributors**: Resolve issues and earn rewards.

6. **Transparent Transactions**: All reward distributions are recorded on the Aptos blockchain, ensuring full transparency and traceability.

## How It Works

1. **Connect**: Log in with your GitHub account and connect your Petra Wallet.
2. **Explore**: Browse participating repositories and open issues.
3. **Contribute**: Pick an issue, work on it, and submit a pull request.
4. **Verification**: Once your PR is merged, our system automatically verifies the contribution.
5. **Reward**: Receive APT tokens directly to your connected wallet.

## Technology Stack

- **Frontend**: React.js with Vite
- **Backend**: Node.js
- **Blockchain**: Aptos
- **Smart Contracts**: Move language
- **Wallet Integration**: Petra Wallet
- **APIs**: GitHub API, Aptos API
- **Transaction Handling**: Aptos SDK

## Getting Started

1. Visit [DevBounty Website](https://devbounty.example.com)
2. Connect your GitHub account
3. Link your Petra Wallet
4. Start exploring open issues and contributing!

## Local Development

To run DevBounty locally, follow these steps:

1. **Clone the repository**
   ```
   git clone https://github.com/your-org/devbounty.git
   cd devbounty
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following variables:
   ```
   VITE_GITHUB_CLIENT_ID=your_github_client_id
   VITE_APTOS_NODE_URL=https://fullnode.devnet.aptoslabs.com/v1
   VITE_APTOS_FAUCET_URL=https://faucet.devnet.aptoslabs.com/v1
   ```

4. **Run the development server**
   ```
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

Note: To interact with the Aptos blockchain, you'll need to set up a local Aptos node or connect to a testnet. Refer to the [Aptos documentation](https://aptos.dev/nodes/local-testnet/local-testnet-index) for more information on setting up a local node.

## Future Roadmap

- Implement advanced fund distribution strategies
- Introduce a governance token for community-driven decision making
- Expand to support multiple Aptos-based tokens for rewards
- Develop a reputation system for contributors

---

DevBounty aims to create a more rewarding and transparent environment for open-source development in the Aptos ecosystem. By bridging the gap between organizations and developers through blockchain technology, we're fostering innovation and collaboration in the decentralized space.

Join us in shaping the future of open-source development on Aptos!