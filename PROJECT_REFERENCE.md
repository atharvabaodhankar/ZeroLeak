# 📖 Project Reference Guide: Paper Leak System (v4.0.0)

This document serves as a comprehensive reference for project reports, exam presentations, and technical deep-dives into the **Zero-Trust Exam Distribution System**.

---

## 📄 1. Project Abstract
The **Paper Leak System** is a decentralized, zero-trust platform designed to eliminate the possibility of exam paper leaks through cryptographic enforcement. Traditional systems rely on human trust—supervisors, printers, or administrators. This system replaces human trust with **mathematical certainty**. 

By utilizing **Ethereum Smart Contracts** for immutable time-locking and **Shamir's Secret Sharing (SSS)** for distributed trust, the system ensures that a question paper remains encrypted and inaccessible until exactly 10 minutes before the exam starts. Keys are generated client-side and purged from memory, ensuring that no single actor (including the government or university board) ever holds the full decryption key prematurely.

---

## 🎯 2. Project Objectives
- **Zero-Human Ownership:** Ensure no person has the decryption key before the designated time.
- **Immutable Timelocking:** Use blockchain timestamps to prevent early data retrieval.
- **Distributed Trust:** Implement 2-of-3 Secret Sharing so that shards are never co-located.
- **Transparency & Audit:** Maintain a public, tamper-proof record of every paper upload and unlock event.
- **Automatic Destruction:** Ensure keys exist only in volatile memory during the 10-minute printing window.

---

## 🔭 3. Project Scope
- **Current Scope:** Secure distribution of high-stakes academic and competitive exam papers.
- **Technical Scope:** React-based frontend for zero-trust encryption, Solidity contracts for timelock logic, and IPFS for decentralized encrypted storage.
- **Future Scope:** Integration with hardware-based "Secure Enclaves" (like Intel SGX) and direct IoT-linked "Smart Printers" to prevent digital leakage during the printing process.

---

## 🖼️ 4. System Diagram Explanation (Exam Ready)
If asked to explain the **AES_K2_SSS_Paper_Pipeline.png** diagram:

1.  **Teacher Module:** The Teacher generates two keys: **K1** (Data Key) and **K2** (Master Key). They encrypt the PDF with K1 and the K1 key with K2.
2.  **Shamir Splitting:** K2 is split into 3 mathematical shares. These shares are like pieces of a puzzle.
3.  **Blockchain Lockbox:** The encrypted data goes to IPFS, but the encrypted K1 and the shards of K2 are sent to the Smart Contract. The contract is programmed to "hide" these shards until the `unlockTimestamp`.
4.  **The Reveal:** At exam time, the Exam Center app fetches enough shards to reconstruct K2. Once K2 is rebuilt, it decrypts K1, which in turn decrypts the original PDF.

---

## 🎓 5. Typical Viva Questions & Answers

### Q1: Why use two layers of keys (K1 and K2)?
**A:** Efficiency and security. AES (K1) is very fast for large files like PDFs. However, we need a way to "lock" K1. By encrypting K1 with K2, we only need to split and manage the small K2 key (the Master Key) using Shamir's Secret Sharing.

### Q2: What is Shamir's Secret Sharing (SSS)?
**A:** It is a cryptographic algorithm that allows a secret to be split into multiple parts (shares). You need a specific number of shares (the threshold) to rebuild the secret. If an attacker gets only one share, they have **zero** information about the original key.

### Q3: How is the "Timelock" enforced?
**A:** It is enforced by the **Solidity Smart Contract**. The function `getDecryptionShares` has a `require` statement that checks `block.timestamp >= unlockTimestamp`. Since blockchain nodes follow strict consensus on time, no one can bypass this check.

### Q4: Why is the backend "Zero-Trust"?
**A:** Because the backend never sees the raw keys or the raw PDF. All encryption happens in the **Frontend (Browser)**. The backend handles coordination, but it is mathematically incapable of leaking the paper because it never "knows" it.

### Q5: What happens if a Teacher's computer is hacked after upload?
**A:** Nothing. The system performs a **Memory Purge** (overwriting variables with zeros) immediately after the transaction is confirmed. The keys are gone from the RAM, so there is no trace left for a hacker.

---
*Reference: SYSTEM.md and SECURITY.md for implementation specifics.*
