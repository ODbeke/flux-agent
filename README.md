# FLUX — Decentralized AI Research Protocol

### AI generates. 0G preserves. Chain verifies.

FLUX is a premium, minimalist AI research dashboard designed for the **0G Aristotle Mainnet**. It transforms ephemeral AI reasoning into permanent, verifiable intellectual capital by anchoring deep synthesis directly into the decentralized 0G Storage mesh and validating identity on the 0G EVM layer.

<img width="2708" height="1504" alt="image" src="https://github.com/user-attachments/assets/93dd0663-1d83-4627-bd6e-abc05f1c40fe" />


---

## The Problem Statement

In the current AI landscape, the generation of knowledge outpaces our ability to verify and secure it.

- Ephemeral Data: AI research findings are often temporary, disappearing when a session ends or a centralized server goes down.

- Zero Provenance: There is no verifiable proof of how or when an AI output was generated.

- Web Disconnection: Outputs are siloed, completely disconnected from the permanent, decentralized web.

- Missing Trust Layer: There is no cryptographic link between a specific AI reasoning session and its long-term archival.

**FLUX** solves this by creating a verifiable lifecycle for every research finding. Every Agent session is cryptographically anchored to 0G storage nodes, ensuring that intellectual capital is permanent, searchable, and provable.

---

## The 0G Stack

**FLUX** leverages the full power of the 0G decentralized infrastructure:

1.  **0G Private Computer (pc.0g.ai)**: Decentralized AI inference engine. Used to synthesize high value research reports via a verifiable GPU network (including **TEE validation**).
   
2.  **0G Storage (Flow Protocol)**: The permanent archival layer. Research blobs are submitted directly to the 0G Flow contract (`0x62D4144dB0F0a6fBBaeb6296c785C71B3D57C526`) to generate Merkle roots and ensure data availability.

3.  **0G Chain (EVM Layer)**: The verification anchor. FLUX mints verifiable **Agent IDs** (ERC-7857 compliant architecture) to the 0G Mainnet, linking the content hash to a permanent Onchain identity.

4.  **0G Indexer & Storage SDK**: Powers the backend to ensure full file replication, meaning research data is consistently indexed and available for download via **0G StorageScan.**

---

## Getting Started

### Prerequisites
- Node.js 18+
- A valid **0G Private Computer API Key** (Get one at [pc.0g.ai](https://pc.0g.ai))
- A funded **0G EVM Wallet** (A0GI tokens required for storage fees)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ODbeke/flux-agent.git
   cd flux-agent
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Create a `.env.local` file with:
   ```bash
   NEXT_PUBLIC_0G_API_KEY=your_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

---

## Smart Contract Architecture

The FLUX protocol is deployed and active on the **0G Aristotle Mainnet**.

| Component | Contract Address |
| :--- | :--- |
| **FLUX Agent Registry** | `0x6b7d20d4588C72cD7A2BEc3aa898fF72b5a1A35E` |
| **0G Flow (Storage)** | `0x62D4144dB0F0a6fBBaeb6296c785C71B3D57C526` |

---

## The Future of Verifiable Thought
We are moving into an era where the sheer volume of AI-generated content makes truth difficult to define. **FLUX** aims to be the foundational layer for intellectual provenance in the Web3 space.

By combining the decentralized inference of the 0G Private Computer with the permanence of 0G Storage, **FLUX** ensures that the research generated today remains verifiable, accessible, and mathematically sound for decades to come.

We aren't just building a dashboard; we are building the infrastructure for the Agent Economy, where AI reasoning has real, permanent stakes.

---

Built for the **0G Aristotle Mainnet Showcase**. 

**AI generates. 0G preserves. Chain verifies.**
