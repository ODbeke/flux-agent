"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Search, 
  Sparkles, 
  Cpu, 
  Database, 
  ExternalLink, 
  Compass, 
  Layers, 
  RefreshCw,
  FileText,
  ShieldCheck,
  Sun,
  Moon
} from "lucide-react";
import { useEffect } from "react";
import { ConfigPanel } from "../../components/ConfigPanel";
import { ExplorerView } from "../../components/ExplorerView";
import { ResearchReportResponse } from "../../services/aiService";
import { generateResearchReportAction, uploadFileDataToNodes } from "../actions";
import { uploadToZeroGravityAndMint, StorageUploadResult } from "../../services/zgService";
import { ethers } from "ethers";

// Lightweight custom Markdown line parser ensuring completely safe, premium DOM mapping
const renderMarkdownLine = (line: string, idx: number) => {
  const trimmed = line.trim();
  if (!trimmed) return <div key={idx} className="h-2" />;

  // Headers
  if (trimmed.startsWith("# ")) {
    return (
      <h2 key={idx} className="text-xl font-bold text-white mt-6 mb-3 pb-1 border-b border-[rgba(255,255,255,0.08)] flex items-center gap-2">
        <span className="text-[#00f2fe]">◆</span> {trimmed.replace(/^#\s+/, "")}
      </h2>
    );
  }
  if (trimmed.startsWith("## ")) {
    return (
      <h3 key={idx} className="text-base font-semibold text-[#f3f4f6] mt-4 mb-2 text-[#00f2fe]">
        {trimmed.replace(/^##\s+/, "")}
      </h3>
    );
  }
  if (trimmed.startsWith("### ")) {
    return (
      <h4 key={idx} className="text-sm font-semibold text-[#d1d5db] mt-3 mb-1">
        {trimmed.replace(/^###\s+/, "")}
      </h4>
    );
  }

  // Horizontal Rule
  if (trimmed === "---") {
    return <hr key={idx} className="my-4 border-t border-[rgba(255,255,255,0.06)]" />;
  }

  // List Items
  if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
    const content = trimmed.replace(/^[-*]\s+/, "");
    return (
      <li key={idx} className="text-xs text-[var(--muted)] ml-4 list-disc my-1 leading-relaxed">
        {renderInlineMarkdown(content)}
      </li>
    );
  }

  // Table Row fallback styling
  if (trimmed.startsWith("|")) {
    const cells = trimmed.split("|").filter(Boolean).map((c) => c.trim());
    const isHeader = trimmed.includes("---");
    if (isHeader) return null; // Skip separator line mapping

    return (
      <div key={idx} className="grid grid-cols-3 gap-2 py-1.5 px-3 border-b border-[rgba(255,255,255,0.04)] text-xs even:bg-[rgba(255,255,255,0.01)]">
        {cells.map((cell, cIdx) => (
          <span key={cIdx} className={cIdx === 0 ? "font-semibold text-[var(--foreground)]" : "text-[var(--muted)]"}>
            {renderInlineMarkdown(cell)}
          </span>
        ))}
      </div>
    );
  }

  // Standard Paragraph
  return (
    <p key={idx} className="text-xs text-[var(--muted)] my-2 leading-relaxed">
      {renderInlineMarkdown(trimmed)}
    </p>
  );
};

// Parses inline bolding and code references safely
const renderInlineMarkdown = (text: string) => {
  const parts = [];
  let remaining = text;
  let keyCounter = 0;

  // Simple token replacements for `code` and **bold**
  while (remaining.length > 0) {
    const codeStart = remaining.indexOf("`");
    const boldStart = remaining.indexOf("**");

    if (codeStart !== -1 && (boldStart === -1 || codeStart < boldStart)) {
      // Push leading plain text
      if (codeStart > 0) {
        parts.push(<span key={keyCounter++}>{remaining.substring(0, codeStart)}</span>);
      }
      remaining = remaining.substring(codeStart + 1);
      const codeEnd = remaining.indexOf("`");
      if (codeEnd !== -1) {
        parts.push(
          <code key={keyCounter++} className="px-1.5 py-0.5 rounded bg-[rgba(0,242,254,0.1)] text-[#00f2fe] font-mono text-[11px]">
            {remaining.substring(0, codeEnd)}
          </code>
        );
        remaining = remaining.substring(codeEnd + 1);
      } else {
        parts.push(<span key={keyCounter++}>`</span>);
      }
    } else if (boldStart !== -1) {
      if (boldStart > 0) {
        parts.push(<span key={keyCounter++}>{remaining.substring(0, boldStart)}</span>);
      }
      remaining = remaining.substring(boldStart + 2);
      const boldEnd = remaining.indexOf("**");
      if (boldEnd !== -1) {
        parts.push(
          <strong key={keyCounter++} className="font-bold text-white">
            {remaining.substring(0, boldEnd)}
          </strong>
        );
        remaining = remaining.substring(boldEnd + 2);
      } else {
        parts.push(<span key={keyCounter++}>**</span>);
      }
    } else {
      parts.push(<span key={keyCounter++}>{remaining}</span>);
      break;
    }
  }

  return <>{parts}</>;
};

export default function Home() {
  // State configurations
  const [topic, setTopic] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [contractAddress, setContractAddress] = useState("0x6F772D147ccB8017Ed5f1817B35E96E70Ab9a288");
  const [walletSigner, setWalletSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [connectedAddress, setConnectedAddress] = useState("");
  const [verifiedAgents, setVerifiedAgents] = useState<StorageUploadResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<StorageUploadResult | null>(null);

  // Execution workflow tracking states
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [reportData, setReportData] = useState<ResearchReportResponse | null>(null);
  const [uploadResult, setUploadResult] = useState<StorageUploadResult | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [errorMsg, setErrorMsg] = useState("");

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  // Dynamic suggestion triggers with auto-shuffle
  const ALL_SUGGESTIONS = [
    "0G Permanent Data Scalability",
    "DePIN compute resource allocation models",
    "Deep Liquidity Staking protocols on 0G",
    "Verifiable AI Inference pipeline",
    "EVM-compatible storage anchoring",
    "Decentralized GPU resource mapping",
    "Cross-chain identity verification",
    "Merkle Tree root validation",
    "Proof of Data Availability consensus",
    "Decentralized reasoning synthesis"
  ];

  const [displaySuggestions, setDisplaySuggestions] = useState<string[]>([]);

  useEffect(() => {
    const shuffle = () => {
      const shuffled = [...ALL_SUGGESTIONS].sort(() => Math.random() - 0.5);
      setDisplaySuggestions(shuffled.slice(0, 3));
    };
    shuffle();
    const interval = setInterval(shuffle, 10000);
    return () => clearInterval(interval);
  }, []);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletSigner(signer);
        setConnectedAddress(address);
        setPrivateKey(""); // Clear private key if wallet is connected to avoid confusion
      } catch (err: any) {
        console.error("Wallet connection failed:", err);
        setErrorMsg("Failed to connect wallet: " + (err.message || "Unknown error"));
      }
    } else {
      setErrorMsg("MetaMask or compatible browser wallet not detected.");
    }
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    // Reset previous loop state
    setReportData(null);
    setUploadResult(null);
    setCurrentStep("");
    setErrorMsg("");
    
    // Step 1: Execute AI synthesis pipeline
    setIsSynthesizing(true);
    try {
      const aiResponse = await generateResearchReportAction(
        topic, 
        apiKey
      );
      setReportData(aiResponse);

      // Step 2: Trigger storage indexing allocation and Agent ID minting sequence
      setIsSynthesizing(false);
      setIsUploading(true);
      
      const zgResponse = await uploadToZeroGravityAndMint(
        aiResponse.markdown,
        privateKey,
        contractAddress,
        (progressStep) => setCurrentStep(progressStep),
        walletSigner
      );

      setUploadResult(zgResponse);
      setVerifiedAgents(prev => [zgResponse, ...prev]);

      // Step 3: Upload actual file data to storage nodes (makes it downloadable on StorageScan)
      // Uses user's private key if provided, otherwise falls back to sponsor key on server
      setCurrentStep("Uploading file data to 0G storage nodes...");
      try {
        const nodeResult = await uploadFileDataToNodes(aiResponse.markdown, privateKey || "");
        if (nodeResult.success) {
          setCurrentStep("✓ File data uploaded — download available on StorageScan!");
        } else {
          console.warn("Node upload warning:", nodeResult.error);
        }
      } catch (nodeErr) {
        console.warn("Node upload failed (non-blocking):", nodeErr);
      }
    } catch (err: any) {
      console.error("Execution sequence failed:", err);
      setErrorMsg(err.message || "An unexpected transaction or network validation exception occurred.");
    } finally {
      setIsSynthesizing(false);
      setIsUploading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = verifiedAgents.find(a => a.agentId === searchQuery || a.mintTxHash === searchQuery);
    setSearchResult(found || null);
    if (!found) {
      setErrorMsg("Agent ID not found in current session registry. In production, this would query the 0G Subgraph.");
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setTopic(suggestionText);
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-10">
      {/* Header Application Bar */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-5 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-4">
          <span className="font-museo font-extrabold text-4xl tracking-tighter text-[#4A6FA5]">FLUX</span>
          <div>
            <h1 id="app-title" className="text-xl md:text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2.5 font-[family-name:var(--font-roboto)]">
              Agent
            </h1>
            <p className="text-xs text-[var(--muted)]">
              AI generates. 0G preserves. Chain verifies
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-xs text-[var(--muted)] bg-[rgba(255,255,255,0.02)] px-3 py-1.5 rounded-lg border border-[var(--card-border)]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981] inline-block animate-ping shrink-0" />
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(0,242,254,0.1)] text-[var(--primary-glow)] border border-[rgba(0,242,254,0.2)] font-mono font-bold uppercase tracking-wider">
                0G Mainnet
              </span>
            </span>
            <span className="text-[var(--card-border)]">|</span>
            <a 
              href="https://storagescan.0g.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#00f2fe] transition-colors flex items-center gap-1"
            >
              StorageScan <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg glass-panel hover:border-[#00f2fe]/40 text-[var(--muted)] hover:text-[#00f2fe] transition-all"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Multi-Column Viewport Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Hand Setup Column */}
        <div className="lg:col-span-3">
          <ConfigPanel
            apiKey={apiKey}
            setApiKey={setApiKey}
            privateKey={privateKey}
            setPrivateKey={setPrivateKey}
            contractAddress={contractAddress}
            setContractAddress={setContractAddress}
            onConnectWallet={connectWallet}
            connectedAddress={connectedAddress}
          />
        </div>

        {/* Central Ingestion & Reporting Column */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Query Instantiation Card */}
          <div className="glass-panel p-6">
            <form onSubmit={handleQuerySubmit} className="flex flex-col gap-4">
              <label htmlFor="research-query" className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider flex items-center gap-2 text-[#00f2fe]">
                <Search className="w-3.5 h-3.5" /> Define Research Topic or Thesis
              </label>
              
              <div className="relative">
                <input
                  id="research-query"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Deep Liquidity Staking protocols on 0G"
                  className="glass-input w-full pr-24 text-sm"
                  disabled={isSynthesizing || isUploading}
                />
                <button
                  id="submit-research-btn"
                  type="submit"
                  disabled={!topic.trim() || isSynthesizing || isUploading}
                  className="absolute right-1.5 top-1.5 bottom-1.5 glow-btn text-xs py-1 px-4 flex items-center gap-1.5"
                >
                  {isSynthesizing || isUploading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                  ) : (
                    "Synthesize"
                  )}
                </button>
              </div>
            </form>

            {/* Quick Trigger Topic Suggestions */}
            <div className="mt-4 pt-3 border-t border-[var(--card-border)]">
              <span className="text-[10px] text-[var(--muted)] block mb-2 font-medium uppercase tracking-wider">
                Search suggestions:
              </span>
              <div className="flex flex-wrap gap-2 transition-all duration-500">
                {displaySuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSuggestionClick(s)}
                    className="text-left text-xs bg-[var(--container-bg)] hover:bg-[rgba(0,242,254,0.08)] border border-[var(--card-border)] hover:border-[#00f2fe] text-[var(--muted)] hover:text-[var(--foreground)] transition-all py-1.5 px-3 rounded-lg flex items-center gap-1.5 shrink-0"
                  >
                    <Compass className="w-3 h-3 text-[#8b5cf6]" /> {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Markdown Structured Findings Layout Viewport */}
          <div className="glass-panel p-6 flex-1 flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00f2fe]" />
                <h3 className="font-semibold text-sm text-[var(--foreground)]">Synthesized Protocol Archive</h3>
              </div>
              
              {reportData && (
                <span className="text-[10px] font-mono text-[#8b5cf6] bg-[rgba(139,92,246,0.1)] px-2 py-0.5 rounded border border-[rgba(139,92,246,0.2)]">
                  {reportData.modelUsed}
                </span>
              )}
            </div>

            {/* Content Core Body Area */}
            <div className="flex-1 flex flex-col">
              {errorMsg ? (
                <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-lg p-4 my-auto text-center max-w-md mx-auto">
                  <span className="text-xs font-bold text-[#ef4444] uppercase tracking-wider block mb-1">
                    Mainnet Verification Error
                  </span>
                  <p className="text-xs text-[#fca5a5] leading-relaxed">
                    {errorMsg}
                  </p>
                  <span className="text-[10px] text-[var(--muted)] block mt-3">
                    Please specify a valid live 0G Compute API key and funded EVM private key (or connect wallet) in the setup panel.
                  </span>
                </div>
              ) : isSynthesizing ? (
                <div className="flex flex-col items-center justify-center flex-1 py-12 gap-3 text-center">
                  <Cpu className="w-10 h-10 text-[#00f2fe] animate-bounce" />
                  <span className="text-xs text-[var(--foreground)] font-medium animate-pulse">
                    Ingesting active mesh weights & mapping protocol state...
                  </span>
                  <p className="text-[10px] text-[var(--muted)] max-w-xs">
                    Calling LLM reasoning backend to structure professional executive summaries.
                  </p>
                </div>
              ) : reportData ? (
                <div className="flex-1 overflow-y-auto pr-1">
                  {/* Safely map custom line breaks */}
                  {reportData.markdown.split("\n").map((line, lIdx) => renderMarkdownLine(line, lIdx))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 py-16 text-center border border-dashed border-[var(--card-border)] rounded-xl my-auto">
                  <Database className="w-8 h-8 text-[#374151] mb-3" />
                  <span className="text-xs font-medium text-[var(--muted)]">Vault Workspace Vacant</span>
                  <p className="text-[11px] text-[var(--muted)] opacity-80 max-w-sm mt-1">
                    Once requested, structural AI output parameters and verification hashes will populate permanently in this viewport.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Proof Stamp Footer */}
            {uploadResult && (
              <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between text-[11px] bg-[rgba(0,242,254,0.02)] p-2.5 rounded-lg border border-[rgba(0,242,254,0.1)]">
                <span className="text-[var(--muted)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Agent Token Issued:
                </span>
                <strong className="text-[#00f2fe] font-mono font-bold tracking-wide">
                  {uploadResult.agentId}
                </strong>
              </div>
            )}
          </div>
        </div>

        {/* Right Hand Onchain Verification Explorer Viewport Column */}
        <div className="lg:col-span-3">
          <ExplorerView
            result={uploadResult}
            isSynthesizing={isSynthesizing}
            isUploading={isUploading}
            currentStep={currentStep}
          />
        </div>
      </div>

      {/* Global Verification Registry Section */}
      <section className="mt-20 pt-10 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2 flex items-center gap-2">
              <Search className="w-6 h-6 text-[#00f2fe]" /> 0G Agent Registry
            </h2>
            <p className="text-[var(--muted)] text-sm">
              Verify the authenticity of any Agent ID generated on the network. Each ID represents a unique, cryptographically anchored AI research finding.
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Enter Agent ID (e.g. AGENT-1234)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input text-xs min-w-[260px]"
            />
            <button type="submit" className="glow-btn px-6 py-2 text-xs font-bold">
              Verify
            </button>
          </form>
        </div>

        {searchResult ? (
          <div className="glass-panel p-6 mb-10 border-[#00f2fe]/30 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#00f2fe] text-xs font-mono font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> VERIFIED AGENT IDENTITY
              </span>
              <button onClick={() => setSearchResult(null)} className="text-[var(--muted)] hover:text-[var(--foreground)] text-xs">Clear</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-[10px] text-[var(--muted)] uppercase block mb-1">Agent ID</label>
                <div className="text-[var(--foreground)] font-mono text-sm">{searchResult.agentId}</div>
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] text-[var(--muted)] uppercase block mb-1">Content Fingerprint</label>
                <div className="text-[#00f2fe] font-mono text-xs break-all">{searchResult.contentHash}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
              <a 
                href={searchResult.explorerLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[11px] text-[#00f2fe] hover:underline flex items-center gap-1.5"
              >
                View Original 0G Chain Proof <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : verifiedAgents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {verifiedAgents.map((agent) => (
              <div key={agent.agentId} className="glass-panel p-4 hover:border-[#00f2fe]/30 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-1.5 rounded-lg bg-[rgba(0,242,254,0.1)] text-[#00f2fe]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] text-[#10b981] font-bold px-1.5 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/20">LIVE</span>
                </div>
                <h3 className="text-sm font-bold text-[var(--foreground)] mb-1">{agent.agentId}</h3>
                <p className="text-[10px] text-[var(--muted)] mb-4 truncate font-mono">{agent.contentHash}</p>
                <button 
                  onClick={() => {
                    setSearchQuery(agent.agentId);
                    setSearchResult(agent);
                  }}
                  className="text-[10px] text-[#00f2fe] font-bold group-hover:underline flex items-center gap-1"
                >
                  View Details <Search className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[var(--container-bg)] rounded-2xl border border-dashed border-[var(--card-border)]">
            <Database className="w-10 h-10 text-[#374151] mx-auto mb-4" />
            <p className="text-[var(--muted)] text-sm">No agents registered in this session yet.</p>
            <p className="text-[11px] text-[var(--muted)] opacity-70 mt-1">Start a research query to mint your first verifiable Agent ID.</p>
          </div>
        )}
      </section>

      {/* Premium Footer Layout */}
      <footer className="mt-12 pt-6 border-t border-[var(--card-border)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--muted)]">
        <div>
          <span className="text-[var(--muted)] font-medium font-museo tracking-tight">FLUX AGENT</span> — Built for the 0G Mainnet Showcase
        </div>
        <div className="flex items-center gap-4">
          <a href="https://docs.0g.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Documentation
          </a>
          <span>•</span>
          <a href="https://build.0g.ai/sdks" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Storage SDKs
          </a>
          <span>•</span>
          <a href="https://compute-marketplace.0g.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Compute Marketplace
          </a>
        </div>
      </footer>
    </div>
  );
}
