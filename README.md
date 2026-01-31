# 🛡️ Decentralized Exam Paper Leak Prevention System

> "The system automatically encrypts all submitted question papers, stores them securely, randomly selects and unlocks one paper 10 minutes before the exam using blockchain-enforced time rules, prints it instantly, and ensures no digital copy exists before or after printing."

## 🚀 System Goal
Prevent exam paper leaks by ensuring that question papers are **unreadable** until **10 minutes before the exam**, using automated encryption, blockchain-based rules, and zero human key ownership.

## 🏗️ High-Level Architecture

| Module | Tech Stack | Role |
|--------|------------|------|
| **[Frontend](./frontend)** | React, Vite, Tailwind | User interface for Teachers, Authorities, and Exam Centers. |
| **[Backend](./backend)** | Node.js, Express, MongoDB | Handles file processing, encryption, and IPFS interaction. |
| **[Contracts](./contracts)** | Solidity, Hardhat | Smart contracts for time-locks, randomness, and audit trails. |
| **Storage** | IPFS (Pinata) | Decentralized storage for encrypted exam paper chunks. |

## 🕹️ System Actors
- **Teacher**: Uploads question papers via the secure portal.
- **Exam Authority**: Schedules exams and sets the unlock time.
- **Exam Center**: Prints the unlocked paper securely at the designated time.

## 🏁 Quick Start Guide

To run the full system locally, you need to set up all three components:

1.  **Smart Contracts**: Deploy to Sepolia testnet to get the contract address.
    ```bash
    cd contracts
    npm install
    npx hardhat run scripts/deploy.js --network sepolia
    ```

2.  **Backend**: Start the server to handle API requests.
    ```bash
    cd backend
    npm install
    # Setup .env (see backend/README.md)
    node server.js
    ```

3.  **Frontend**: Run the user interface.
    ```bash
    cd frontend
    npm install
    # Setup .env (see frontend/README.md)
    npm run dev
    ```

## 🔐 Security Features
- **Zero-Knowledge Storage**: The backend never stores decrypted papers or keys.
- **Time-Lock**: Papers cannot be accessed before the blockchain timestamp.
- **Audit Trail**: All actions (upload, unlock, selection) are recorded on-chain.

---
*Based on SYSTEM.md design.*
