import React, { useState } from "react";
import { 
  Key, 
  Wallet, 
  Settings2, 
  Sparkles, 
  Code, 
  Eye, 
  EyeOff,
  Sliders,
  CheckCircle2,
  Cpu,
  Copy,
  Check
} from "lucide-react";

interface ConfigPanelProps {
  apiKey: string;
  setApiKey: (val: string) => void;
  privateKey: string;
  setPrivateKey: (val: string) => void;
  contractAddress: string;
  setContractAddress: (val: string) => void;
  onConnectWallet: () => Promise<void>;
  connectedAddress: string;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  apiKey,
  setApiKey,
  privateKey,
  setPrivateKey,
  contractAddress,
  setContractAddress,
  onConnectWallet,
  connectedAddress
}) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel p-6 flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[rgba(139,92,246,0.1)] text-[#8b5cf6]">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-[var(--foreground)]">Mainnet Setup</h2>
            <p className="text-xs text-[var(--muted)]">Live inference & wallet credentials</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-7 flex-1">
        {/* Agent ID Standard Registry Contract Address */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[var(--foreground)] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-[#00f2fe]" /> Contract Address
            </span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={contractAddress}
              readOnly
              placeholder="0x96217aE0ee2737266F1cBF9A5539F0b4e99B0BEF"
              className="glass-input text-[10px] font-mono flex-1 cursor-default truncate"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="p-2.5 rounded-lg glass-panel text-[var(--muted)] hover:text-[#00f2fe] flex items-center justify-center shrink-0"
              title="Copy Contract Address"
            >
              {copied ? <Check className="w-4 h-4 text-[#10b981]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-[var(--muted)]">
            The specific mainnet smart contract anchoring findings to unique Agent ID tokens.
          </p>
        </div>

        <div className="border-t border-[var(--card-border)] opacity-40 mx-2" />

        {/* 0G Compute API Key */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[var(--foreground)] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#00f2fe]" /> 0G Compute API Key
            </span>
            <span className="text-[10px] text-[var(--primary-glow)] bg-[rgba(0,242,254,0.1)] px-1.5 py-0.5 rounded border border-[rgba(0,242,254,0.2)]">
              Decentralized GPU
            </span>
          </label>
          <div className="flex gap-2">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="0G_API_KEY_..."
              className="glass-input text-[10px] font-mono flex-1"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="p-2.5 rounded-lg glass-panel text-[var(--muted)] hover:text-[var(--foreground)] flex items-center justify-center shrink-0"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-[var(--muted)]">
            Paste your API key from the <a href="https://pc.0g.ai" target="_blank" rel="noopener noreferrer" className="text-[var(--primary-glow)] font-bold hover:underline">pc.0g.ai dashboard</a> to execute verifiable, decentralized research.
          </p>
        </div>

        <div className="border-t border-[var(--card-border)] opacity-40 mx-2" />

        {/* Wallet Connection / Private Key Section */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[var(--foreground)] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-[#10b981]" /> Signer Authorization
            </span>
            {connectedAddress && (
              <span className="text-[10px] text-[#10b981] font-mono flex items-center gap-1 animate-pulse">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            )}
          </label>
          
          {connectedAddress ? (
            <div className="glass-panel p-3 bg-[rgba(16,185,129,0.05)] border-[rgba(16,185,129,0.2)] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider">Account</span>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-[10px] text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-2"
                >
                  Disconnect
                </button>
              </div>
              <div className="text-xs font-mono text-white truncate bg-black/30 p-2 rounded border border-white/5">
                {connectedAddress}
              </div>
              <p className="text-[10px] text-[var(--muted)]">
                On-chain transactions signed via browser wallet.
              </p>
            </div>
          ) : (
            <button 
              onClick={onConnectWallet}
              className="glow-btn py-2.5 text-xs flex items-center justify-center gap-2"
            >
              <Wallet className="w-4 h-4 text-black" /> Connect Browser Wallet
            </button>
          )}

          {/* Private Key — always visible for full storage replication */}
          <div className="mt-1">
            <label className="text-xs font-medium text-[var(--foreground)] flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#f59e0b]" /> Private Key
                <span className="text-[9px] text-[#f59e0b] bg-[rgba(245,158,11,0.1)] px-1.5 py-0.5 rounded border border-[rgba(245,158,11,0.2)]">
                  {connectedAddress ? "Optional" : "Recommended"}
                </span>
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type={showPrivateKey ? "text" : "password"}
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="0xabcd1234..."
                className="glass-input text-[10px] font-mono flex-1"
              />
              <button
                type="button"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="p-2.5 rounded-lg glass-panel text-[var(--muted)] hover:text-[var(--foreground)] flex items-center justify-center shrink-0"
              >
                {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-[var(--muted)] mt-1">
              {connectedAddress 
                ? "Add your key to enable full file replication to 0G storage nodes (enables download on StorageScan)." 
                : "Your funded 0G EVM key — used for both Onchain Proof and Storage Node upload."}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
