# ⛓️ Exam Paper System - Smart Contracts

This directory contains the Solidity smart contracts that power the immutable time-lock, random paper selection, and audit trail of the system.

## 🛠️ Tech Stack
- **Framework**: Hardhat
- **Language**: Solidity (v0.8.20)
- **Network**: Sepolia Testnet (default)
- **Testing**: Chai / Mocha

## 🚀 Setup & Installation

1.  **Navigate to the contracts directory:**
    ```bash
    cd contracts
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `contracts` root directory and add:
    ```env
    SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY"
    PRIVATE_KEY="your-wallet-private-key"
    ETHERSCAN_API_KEY="your-etherscan-api-key" # Optional, for verification
    ```

## 📜 Commands

### Compile Contracts
```bash
npx hardhat compile
```

### Deploy to Sepolia
```bash
npx hardhat run scripts/deploy.js --network sepolia
```
*After deployment, the `deployment-info.json` file will be updated automatically with the new contract address. The frontend reads from this file.*

### Run Tests
```bash
npx hardhat test
```

## 🧩 Key Contracts
- **ExamRegistry**: Stores the hashes of encrypted papers and manages the time-locked release logic.

## ⚠️ security Warning
- Never commit your `.env` file containing private keys.
- Ensure your `PRIVATE_KEY` account has enough Sepolia ETH for gas fees.
