"use server";

import { generateResearchReport as generateReportLib, ResearchReportResponse } from "../services/aiService";
import { Indexer, ZgFile } from "@0gfoundation/0g-storage-ts-sdk";
import { ethers } from "ethers";
import { writeFileSync, unlinkSync, mkdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

// Sponsor key used for server-side replication (Step 3) when user uses MetaMask
const SPONSOR_KEY = process.env.SPONSOR_PRIVATE_KEY || "";

export async function generateResearchReportAction(
  topic: string,
  apiKey: string
): Promise<ResearchReportResponse> {
  try {
    return await generateReportLib(topic, apiKey);
  } catch (error: unknown) {
    console.error("AI Action Error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(msg || "Failed to generate AI research report on server.");
  }
}

/**
 * Computes correct 0G Metadata (Root and Length) for a file.
 * Using a server action allows us to use the Node-only SDK ZgFile safely.
 */
export async function get0GMetadataAction(content: string): Promise<{ root: string; length: number }> {
  const tmpFile = join(tmpdir(), `metadata-${Date.now()}.txt`);
  
  try {
    writeFileSync(tmpFile, content, "utf-8");
    const zgFile = await ZgFile.fromFilePath(tmpFile);
    const [root, length] = await zgFile.merkleRoot();
    
    // Safety check: ensure length is at least the content length
    const contentLen = Buffer.from(content).length;
    const finalLen = Number(length) > contentLen ? Number(length) : contentLen;
    
    return { root, length: finalLen };
  } catch (error: unknown) {
    console.error("0G Metadata Error:", error);
    throw new Error("Failed to compute 0G storage metadata.");
  } finally {
    try { unlinkSync(tmpFile); } catch (_) {}
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
  const EVM_RPC = process.env.NEXT_PUBLIC_0G_RPC || "https://evmrpc.0g.ai";
  const INDEXER_RPC = process.env.NEXT_PUBLIC_0G_INDEXER || "https://indexer-storage-turbo.0g.ai";

  console.log("0G NODE UPLOAD: Starting file data upload to storage nodes...");

  // Write content to a temporary file (ZgFile requires a file path in Node.js)
  const tmpFile = join(tmpdir(), `flux-report-${Date.now()}.txt`);
  
  try {
    writeFileSync(tmpFile, content, "utf-8");

    const provider = new ethers.JsonRpcProvider(EVM_RPC);
    const finalKey = (privateKey && privateKey.trim()) ? privateKey.trim() : SPONSOR_KEY;

    if (!finalKey) {
      return { success: false, error: "No storage key available (User or Sponsor). Connect a wallet with a key or set 0G_SPONSOR_PRIVATE_KEY." };
    }

    const signer = new ethers.Wallet(finalKey, provider);
    console.log(`0G NODE UPLOAD: Replication initiated by: ${signer.address}`);

    const indexer = new Indexer(INDEXER_RPC);
    const zgFile = await ZgFile.fromFilePath(tmpFile);

    console.log("0G NODE UPLOAD: Calling indexer.upload (full SDK pipeline)...");
    const [txHash, uploadErr] = await indexer.upload(zgFile, EVM_RPC, signer);

    if (uploadErr) {
      console.error("0G NODE UPLOAD: Error:", uploadErr);
      return { success: false, error: String(uploadErr) };
    }

    console.log(`0G NODE UPLOAD: Success! Tx: ${txHash}`);
    return { success: true };
  } catch (error: unknown) {
    console.error("0G NODE UPLOAD: Fatal:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown upload error" };
  } finally {
    // Clean up temp file
    try { unlinkSync(tmpFile); } catch (_) {}
  }
}
