"use server";

import { generateResearchReport as generateReportLib, ResearchReportResponse } from "../services/aiService";
import { Indexer, ZgFile } from "@0gfoundation/0g-storage-ts-sdk";
import { ethers } from "ethers";
import { writeFileSync, unlinkSync, mkdirSync } from "fs";
import { join } from "path";

export async function generateResearchReportAction(
  topic: string,
  apiKey: string
): Promise<ResearchReportResponse> {
  try {
    return await generateReportLib(topic, apiKey);
  } catch (error: any) {
    console.error("AI Action Error:", error);
    throw new Error(error.message || "Failed to generate AI research report on server.");
  }
}

/**
 * Uploads file data to 0G storage nodes using the SDK.
 * This makes the file downloadable on StorageScan.
 * Must be called AFTER the on-chain Flow.submit succeeds.
 */
export async function uploadFileDataToNodes(
  content: string,
  privateKey: string
): Promise<{ success: boolean; error?: string }> {
  const EVM_RPC = "https://evmrpc.0g.ai";
  const INDEXER_RPC = "https://indexer-storage-turbo.0g.ai";

  console.log("0G NODE UPLOAD: Starting file data upload to storage nodes...");

  // Write content to a temporary file (ZgFile requires a file path in Node.js)
  const tmpDir = join(process.cwd(), ".0g-tmp");
  const tmpFile = join(tmpDir, `flux-report-${Date.now()}.txt`);
  
  try {
    mkdirSync(tmpDir, { recursive: true });
    writeFileSync(tmpFile, content, "utf-8");

    const provider = new ethers.JsonRpcProvider(EVM_RPC);

    if (!privateKey.trim()) {
      return { success: false, error: "Private key required for full storage node replication." };
    }

    const signer = new ethers.Wallet(privateKey.trim(), provider);
    console.log(`0G NODE UPLOAD: Wallet: ${signer.address}`);

    const indexer = new Indexer(INDEXER_RPC);
    const zgFile = await ZgFile.fromFilePath(tmpFile);

    console.log("0G NODE UPLOAD: Calling indexer.upload (full SDK pipeline)...");
    const [txHash, uploadErr] = await indexer.upload(zgFile as any, EVM_RPC, signer);

    if (uploadErr) {
      console.error("0G NODE UPLOAD: Error:", uploadErr);
      return { success: false, error: String(uploadErr) };
    }

    console.log(`0G NODE UPLOAD: Success! Tx: ${txHash}`);
    return { success: true };
  } catch (error: any) {
    console.error("0G NODE UPLOAD: Fatal:", error);
    return { success: false, error: error.message || "Unknown upload error" };
  } finally {
    // Clean up temp file
    try { unlinkSync(tmpFile); } catch (_) {}
  }
}
