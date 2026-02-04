# 🛡️ Paper Leak System (v4.0.0)

> **Zero-Trust Decentralized Exam Paper Distribution**
> A military-grade secure system designed to prevent leaks by ensuring question papers remain unreadable until exactly exam time, enforced by blockchain timelocks and distributed cryptographic trust.

## 🚀 The Peak Security Vision
This system ensures that **no single individual**, including the Teacher or the Exam Authority, ever owns the keys required to decrypt a paper prematurely. Trust is mathematically distributed through the network.

---

## 🏗️ Peak Security Architecture
The system employs a **Two-Layer Cryptographic Pipeline** with **Shamir's Secret Sharing (SSS)**.

### 🧩 The Security Pipeline:
1.  **Layer 1 (Data):** Paper PDF is encrypted using highly efficient **AES-256-GCM** with a unique key (**K1**).
2.  **Layer 2 (Key):** The AES key (**K1**) is itself encrypted using a **Master Key** (**K2**).
3.  **Trust Distribution:** **K2** is mathematically split into `n` shards (shares) using **Shamir's Secret Sharing**.
4.  **Immutable Timelock:** Encrypted **K1** and the shards of **K2** are committed to the **Ethereum (Sepolia)** blockchain, locked behind a smart contract timer.

### 🖼️ Transition Diagram
![Paper Pipeline](./AES_K2_SSS_Paper_Pipeline.png)

---

## 🛠️ Technology Stack
| Module | Tech Stack | Role |
|--------|------------|------|
| **Frontend** | React, Vite, Tailwind | Zero-trust client handling client-side encryption/decryption. |
| **Contracts** | Solidity, Hardhat | Hard-enforced timelocks & decentralized share storage. |
| **Polyfills** | Browser-Native Crypto | Secure random generation without Node.js dependencies. |
| **Storage** | IPFS (Pinata) | Decentralized storage for encrypted data "blobs". |

---

## 🔄 Workflow Summary
-   **Teacher Role**: Uploads the paper. Frontend performs a **Memory Purge** immediately after upload, ensuring the raw keys (**K1**, **K2**) are destroyed and never leak.
-   **Authority Role**: Schedules the exam by setting the `unlockTimestamp`. They **cannot** see the paper shards or the content.
-   **Exam Center Role**: At the exact exam time, the frontend fetches shards from the blockchain, reconstructs **K2**, decrypts **K1**, and finally reveals the paper for instant printing.

---

## 🏁 Quick Start

### 1. Smart Contracts
```bash
cd contracts
npm install
npx hardhat run scripts/deploy.js --network sepolia
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Key Features
-   ✅ **Zero-Knowledge Architecture**: Authority manages schedules without seeing data.
-   ✅ **Shamir's Secret Sharing (SSS)**: No single-point-of-failure for cryptographic keys.
-   ✅ **Blockchain Timelocks**: Immutable enforcement of "Unlock Time".
-   ✅ **Memory Isolation**: Cryptographic keys are purged from local RAM post-upload.

---
*Developed for Peak Security and Unbreakable Integrity.*
