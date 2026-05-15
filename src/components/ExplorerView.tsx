import React from "react";
import { 
  CheckCircle2, 
  Loader2, 
  ExternalLink, 
  ShieldCheck, 
  Database, 
  Cpu, 
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
                ? "Research data permanently archived." 
                : "Ready to stage file blob sequence."}
            </p>
            {result && (
              <a 
                href={result.storageScanLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-[#8b5cf6] font-bold hover:underline"
              >
                View on StorageScan <ExternalLink className="w-3 h-3" />
              </a>
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
              <ShieldCheck className="w-4 h-4 text-[#10b981]" /> 3. Onchain Identity Commit
            </span>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {result 
                ? "Pending final block inclusion state." 
                : "Awaiting sequence confirmation."}
            </p>
            {result && (
              <a 
                href={result.explorerLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-[#10b981] font-bold hover:underline"
              >
                Verify on 0G Chainscan <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>


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
