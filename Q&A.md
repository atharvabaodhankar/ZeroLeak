# 🔐 ZeroLeak – Q&A 

### *Zero-Trust Decentralized Exam Paper Security*

---

## ❓ Q1. What is ZeroLeak?

**Answer:**
ZeroLeak is a **decentralized, zero-trust exam paper distribution system** designed to prevent exam paper leaks.
It ensures that question papers remain **cryptographically unreadable** until **10 minutes before the exam**, enforced by mathematics and blockchain — not human trust.

---

## ❓ Q2. What problem does ZeroLeak solve?

**Answer:**
Traditional exam systems rely on **trusted people** (authorities, printers, administrators).
This is exactly where leaks happen.

ZeroLeak removes this dependency by ensuring:

* No human owns the decryption keys
* No authority can unlock papers early
* No server stores readable papers
* Time itself (via blockchain) controls access

---

## ❓ Q3. How does ZeroLeak work? (Simple Flow)

**Answer:**

### 🔹 Step 1: Paper Submission (Before Exam Day)
* Teachers upload question papers
* The paper is **automatically encrypted in the browser**
* Encryption keys are destroyed immediately
* Only encrypted data is stored
👉 After upload, **even the teacher cannot open the paper again**

### 🔹 Step 2: Secure Storage
* Encrypted paper chunks are stored on **IPFS**
* Cryptographic references (hashes, time rules) are stored on **blockchain**
* No readable data exists anywhere

### 🔹 Step 3: Exam Scheduling
* Exam Authority only sets:
  * Exam time
  * Unlock time (10 minutes before exam)
* Authority **does NOT get access to paper data or keys**

### 🔹 Step 4: Time-Locked Unlock
* Before unlock time → blockchain rejects all access
* At unlock time → access is mathematically allowed
* Only assigned exam centers can proceed

### 🔹 Step 5: Exam Day Reveal
* Exam center decrypts paper **only at unlock time**
* Paper is printed immediately
* Digital copy is destroyed
* Exam begins normally

---

## ❓ Q4. Where is the paper stored?

**Answer:**
The paper is **never stored in readable form**.

| Location       | What is stored                    |
| -------------- | --------------------------------- |
| Teacher device | Encrypted → then deleted          |
| Backend server | Nothing sensitive                 |
| IPFS           | Encrypted chunks only             |
| Blockchain     | Hashes + encrypted keys           |
| Exam center    | Plaintext exists only for minutes |

---

## ❓ Q5. What exactly is stored on the blockchain?

**Answer:**
Blockchain stores only a **cryptographic bill of materials**, not the paper itself:
* IPFS Content IDs (encrypted chunks)
* Encrypted AES key (K1)
* Shamir Secret Sharing shards of master key (K2)
* Unlock timestamp
* Exam center assignments

---

## ❓ Q6. Why can’t exam authorities access or leak the paper?

**Answer:**
Because **they never have the keys**.
The Authority manages the process (scheduling centers), but they never possess the shards or the threshold required to reconstruct the Master Key. The smart contract enforces that only an assigned center can fetch shards, and only *after* the timer.

---

## ❓ Q7. What if the exam authority is corrupt?

**Answer:**
It doesn’t matter.
ZeroLeak assumes every human in the chain can be corrupt. The system relies on **mathematical-truth** rather than **human-trust**. Without the threshold of keys (which are locked on-chain until the timer), corruption doesn't lead to a leak.

---

## ❓ Q8. Can someone hack the blockchain or change time?

**Answer:**
No. 
Blockchain time (`block.timestamp`) is agreed upon by thousands of independent nodes. Hacking it would require a 51% attack on the entire Ethereum network, which is computationally and economically impossible.

---

## ❓ Q9. What if someone reads blockchain data directly?

**Answer:**
Even then, nothing leaks.
Individual shards reveal **zero** information about the original key according to the information-theoretic security of Shamir's Secret Sharing. You need to combine the threshold of shards (at least 2-of-3) to learn anything.

---

## ❓ Q10. Why use two encryption keys (K1 & K2)?

**Answer:**
* **K1 (AES)** encrypts the actual PDF (high performance).
* **K2 (Master Key)** encrypts K1.
* K2 is sharded using Shamir's algorithm.
This multi-layered approach ensures we can distribute small keys securely while keeping large file data efficient.

---

## ❓ Q11. Is this system realistic for schools and colleges?

**Answer:**
Yes. 
It requires standard hardware (computer + printer) and an internet connection. It replaces the physical "courier" system with a secure "digital delivery" system that is actually more reliable and transparent.

---

## 🏁 FINAL SUMMARY

**ZeroLeak transforms exam security from a human-trust model into a mathematical-truth model.**
Even system administrators and exam authorities have **zero power** to leak or manipulate papers before the scheduled time.
