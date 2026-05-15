# FLUX — Decentralized AI Research Protocol

### AI generates. 0G preserves. Chain verifies.

FLUX is a premium, minimalist AI research dashboard designed for the **0G Aristotle Mainnet**. It transforms ephemeral AI reasoning into permanent, verifiable intellectual capital by anchoring deep synthesis directly into the decentralized 0G Storage mesh and validating identity on the 0G EVM layer.

---

## 🌪️ The Problem Statement

In the current AI landscape, research findings are often **ephemeral and non-verifiable**. 
- AI outputs are disconnected from the permanent web.
- Proof of data provenance is missing.
- There is no cryptographic link between a specific AI reasoning session and its long-term archival.

**FLUX solves this** by creating a verifiable lifecycle for every research finding. Every "Agent" session is cryptographically anchored to 0G storage nodes, ensuring that intellectual capital is permanent, searchable, and provable.

---

## 🛠️ The 0G Stack

FLUX leverages the full power of the 0G decentralized infrastructure:

1.  **0G Private Computer (pc.0g.ai)**: Decentralized AI inference engine. Used to synthesize high-value research reports via a verifiable GPU network (including TEE validation).
2.  **0G Storage (Flow Protocol)**: The permanent archival layer. Research blobs are submitted directly to the 0G Flow contract (`0x62D4144dB0F0a6fBBaeb6296c785C71B3D57C526`) to generate Merkle roots and ensure data availability.
3.  **0G Chain (EVM Layer)**: The verification anchor. FLUX mints verifiable **Agent IDs** (ERC-7857 compliant architecture) to the 0G Mainnet, linking the content hash to a permanent on-chain identity.
4.  **0G Indexer & Storage SDK**: Used for full file replication, ensuring that research data is indexed and available for download on **0G StorageScan**.

---

## 🚀 Getting Started

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

## 📜 Smart Contract Architecture

The FLUX protocol is deployed and active on the **0G Aristotle Mainnet**.

| Component | Address |
| :--- | :--- |
| **FLUX Agent Registry** | `0x6F772D147ccB8017Ed5f1817B35E96E70Ab9a288` |
| **0G Flow (Storage)** | `0x62D4144dB0F0a6fBBaeb6296c785C71B3D57C526` |

---

## 💎 Design Philosophy

FLUX is built with a **"High-Status Minimalist"** aesthetic, drawing inspiration from Apple, Notion, and Stripe.
- **Typography**: MuseoModerno for branding, Poppins for headers, and Montserrat for technical data.
- **Micro-interactions**: Glossy hover-zoom effects, heartbeat pulsations for CTAs, and a seamless glassmorphism UI.
- **UX**: A focused execution pipeline that guides the user from raw query to permanent on-chain verification in seconds.

---

Built for the **0G Aristotle Mainnet Showcase**. 
**AI generates. 0G preserves. Chain verifies.**
