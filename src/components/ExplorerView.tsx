import React from "react";
import { 
  CheckCircle2, 
  Loader2, 
  ExternalLink, 
  ShieldCheck, 
  Database, 
  Cpu, 
  FileText,
  Layers
} from "lucide-react";
import { StorageUploadResult } from "../services/zgService";

interface ExplorerViewProps {
  result: StorageUploadResult | null;
  isSynthesizing: boolean;
  isUploading: boolean;
  currentStep: string;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({
  result,
  isSynthesizing,
  isUploading,
  currentStep
}) => {
  return (
    <div className="glass-panel p-6 flex flex-col h-full sticky top-6">
      <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-4 mb-6">
        <div className="p-2 rounded-lg bg-[rgba(0,242,254,0.1)] text-[#00f2fe]">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-semibold text-lg text-[var(--foreground)]">0G Network Explorer</h2>
          <p className="text-xs text-[var(--muted)]">Mainnet Integration Flow (Chain ID: 16661)</p>
        </div>
      </div>

      {/* Execution Pipeline Steps Tracker */}
      <div className="flex flex-col gap-5 flex-1">
        {/* Step 1: AI Inference Engine */}
        <div className="flex gap-4 items-start">
          <div className="mt-0.5 relative">
            {isSynthesizing ? (
              <Loader2 className="w-5 h-5 text-[#00f2fe] animate-spin" />
            ) : result || isUploading ? (
              <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-[#374151]" />
            )}
            {/* Connecting Connector line */}
            <div className="absolute left-2.5 top-6 bottom-[-16px] w-[2px] bg-gradient-to-b from-[#374151] to-transparent" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-[var(--foreground)] flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#00f2fe]" /> 1. AI Inference Pipeline
            </span>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {isSynthesizing 
                ? "Synthesizing topic weights via specified compute provider..." 
                : result || isUploading 
                ? "Report successfully generated in valid Markdown structure." 
                : "Awaiting user trigger query input."}
            </p>
          </div>
        </div>

        {/* Step 2: 0G Storage Blob Submission */}
        <div className="flex gap-4 items-start">
          <div className="mt-0.5 relative">
            {isUploading && !result ? (
              <Loader2 className="w-5 h-5 text-[#8b5cf6] animate-spin" />
            ) : result ? (
              <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-[#374151]" />
            )}
            <div className="absolute left-2.5 top-6 bottom-[-16px] w-[2px] bg-gradient-to-b from-[#374151] to-transparent" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-[var(--foreground)] flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#8b5cf6]" /> 2. Permanent 0G Storage
            </span>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {isUploading && !result 
                ? currentStep || "Calculating Merkle tree proof roots..." 
                : result 
                ? "Allocated blocks on ZeroGravity disk nodes." 
                : "Ready to stage file blob sequence."}
            </p>
            {result && (
              <div className="mt-2 p-2 rounded bg-[var(--container-bg)] border border-[var(--card-border)] font-mono text-[11px] break-all text-[#00f2fe]">
                <span className="text-[var(--muted)] block text-[9px] uppercase">Content Hash:</span>
                {result.contentHash}
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Agent ID Issuance */}
        <div className="flex gap-4 items-start">
          <div className="mt-0.5">
            {result ? (
              <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-[#374151]" />
            )}
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-[var(--foreground)] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" /> 3. Agent ID Verifiable Anchor
            </span>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {result 
                ? "ERC-7857 digital identity successfully registered onchain." 
                : "Pending final block inclusion state."}
            </p>
            {result && (
              <div className="flex flex-col gap-2 mt-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] text-[#10b981] font-mono text-xs font-bold w-fit">
                  {result.agentId}
                </div>
                <div className="p-3 rounded-lg bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.1)]">
                  <p className="text-[10px] text-[#10b981] leading-relaxed">
                    <strong>Verification Guide</strong>: Copy this ID and look for the <code>AgentMinted</code> event on the 0G Chain Explorer. The event anchors your <strong>Content Hash</strong> to this specific Agent Identity.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Explorer Verification Links Section */}
      {result && (
        <div className="mt-6 pt-5 border-t border-[rgba(255,255,255,0.08)] flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
            Cryptographic Proof Access
          </span>

          <div className="bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.1)] p-3 rounded-lg mb-2">
            <p className="text-[10px] text-[#10b981] leading-relaxed">
              <span className="font-bold block mb-1">Hash Verification Guide:</span>
              • <strong>Content Hash</strong> (Top): The unique fingerprint of your research data.<br/>
              • <strong>Transaction Hash</strong> (Bottom): The permanent receipt of your 0G Mainnet broadcast.
            </p>
          </div>

          <a
            href={result.explorerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[var(--card-border)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[#00f2fe] transition-all group gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#00f2fe] shrink-0" />
                <span className="text-xs font-medium text-[var(--foreground)]">Verify on 0G Chainscan</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--muted)] group-hover:text-[#00f2fe]" />
            </div>
            
            <div className="mt-1 p-2 rounded bg-[var(--container-bg)] border border-[var(--card-border)] font-mono text-[9px] text-[#00f2fe] leading-tight flex flex-col gap-1">
              <span className="text-[var(--muted)] uppercase">On-Chain Transaction Receipt:</span>
              <div className="break-all opacity-80">
                {result.mintTxHash}
              </div>
            </div>
          </a>

          <a
            href={result.storageScanLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[#8b5cf6] transition-all group gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-[#8b5cf6] shrink-0" />
                <span className="text-xs font-medium text-white">View on 0G StorageScan</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#9ca3af] group-hover:text-[#8b5cf6]" />
            </div>
            
            <div className="mt-1 p-2 rounded bg-[var(--container-bg)] border border-[var(--card-border)] font-mono text-[9px] text-[#8b5cf6] leading-tight flex flex-col gap-1">
              <span className="text-[var(--muted)] uppercase">Storage Layer Index:</span>
              <div className="break-all opacity-80">
                {result.storageTxHash}
              </div>
            </div>
          </a>

          <div className="p-3 rounded-lg bg-[var(--container-bg)] border border-[var(--card-border)]">
            <p className="text-[9px] text-[var(--muted)] italic">
              Verification Successful: Your Agent ID is minted on the EVM layer, and the content blob has been anchored to the decentralized 0G Storage nodes.
            </p>
          </div>
        </div>
      )}

      {!result && !isSynthesizing && !isUploading && (
        <div className="mt-6 p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] text-center">
          <p className="text-[11px] text-[#6b7280]">
            Input a target protocol or thesis to instantiate the automated verification flow.
          </p>
        </div>
      )}
    </div>
  );
};
