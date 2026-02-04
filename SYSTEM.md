# 🧠 SYSTEM DESIGN (v4.0.0)

## Decentralized Exam Paper Leak Prevention System
### *The "Peak Security" Zero-Trust Architecture*

---

## 1️⃣ SYSTEM GOAL
> Eliminate exam paper leaks by ensuring question papers remain mathematically unreadable until **10 minutes before the exam**. This is achieved through automated client-side encryption, distributed trust via **Shamir's Secret Sharing**, and immutable **Blockchain Timelocks**.

---

## 2️⃣ ACTORS & RESPONSIBILITIES

| Actor                             | Responsibility                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------ |
| **Teacher**                       | Generates keys, encrypts paper locally, and purges keys from memory after upload. |
| **Exam Authority**                | Schedules exams and assigns centers. **Cannot** see or decrypt paper content.   |
| **Blockchain (Ethereum/Sepolia)** | Enforces the "Unlock Time" and stores distributed secret shards.               |
| **IPFS (Storage)**                | Stores highly-encrypted, sharded data blobs.                                  |
| **Exam Center**                   | Fetches shards and reconstructs keys *only* at the scheduled time.             |

---

## 3️⃣ PEAK SECURITY ARCHITECTURE

### 🧩 The Two-Layer Pipeline
Instead of a single key, we use a hierarchical encryption model to prevent any single-point-of-failure.

1.  **Layer 1 (Data):** The PDF is encrypted using **AES-256-GCM** (**K1**).
2.  **Layer 2 (Master):** Key **K1** is encrypted using a **Master Key** (**K2**).
3.  **Distributed Trust:** **K2** is split into **SSS Shards** (e.g., 2-of-3 threshold).

### 🖼️ High-Level Flow
![Paper Pipeline](./AES_K2_SSS_Paper_Pipeline.png)

---

## 4️⃣ CORE COMPONENTS

### 🔹 1. Zero-Trust Frontend
Encryption happens entirely in the browser. 
- **Memory Purge:** Once a paper is uploaded, the raw keys (**K1**, **K2**) are overwritten with zeros and dereferenced in RAM.
- **Client-Side Security:** No plaintext paper ever touches the backend or blockchain.

### 🔹 2. Blockchain Rule Enforcer
The smart contract (`ExamRegistry.sol`) acts as the "Ultimate Timer".
- **Immutable Timelock:** The contract logic prevents returning decryption shards until `block.timestamp >= unlockTimestamp`.
- **Public Audit Log:** Every action is transparently recorded for post-exam auditing.

### 🔹 3. IPFS Decentralized Storage
Encrypted PDF chunks are stored on IPFS.
- **Content Addressing:** Files are fetched via unique CIDs, ensuring they haven't been tampered with.

---

## 5️⃣ TIME-BASED LIFECYCLE

| Phase        | Time | Action |
| ----------- | --- | --- |
| **Preparation** | Days before | Teacher uploads encrypted paper; Master Key shards locked in contract. |
| **Scheduling**  | Hours before | Authority sets exactly when the contract will reveal the shards. |
| **Selection**   | ⏰ T-10 Mins | Contract reaches `unlockTimestamp`. Shards become fetchable. |
| **Reveal**      | ⏰ T-10 Mins | Exam Center reconstructs Master Key, decrypts paper, and prints. |

---

## 6️⃣ THREAT MODEL & DEFENSES

| Threat | System Defense |
| --- | --- |
| **Authority Corruption** | Authority has zero keys; they only manage the schedule. |
| **Admin Database Hack** | No keys are stored in any database; they are locked on-chain. |
| **Teacher Leakage** | Local memory is purged instantly post-upload. |
| **Early Center Access** | Blockchain nodes reject requests before the unlock timestamp. |
| **Data At Rest Theft** | Data on IPFS is double-encrypted (K1 + K2). |

---

## 7️⃣ SUMMARY
The Paper Leak System (v4.0.0) transforms the exam distribution process from a "human-trust" model to a **"mathematical-truth"** model. By distributing trust across the blockchain and purging keys from local volatile memory, we have created the most secure environment possible for high-stakes academic integrity.

---
*Reference: SECURITY.md for cryptographic details.*
