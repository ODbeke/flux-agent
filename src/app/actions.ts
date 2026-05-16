"use server";

import { generateResearchReport as generateReportLib, ResearchReportResponse } from "../services/aiService";
import { Indexer, ZgFile } from "@0gfoundation/0g-storage-ts-sdk";
import { ethers } from "ethers";
import { writeFileSync, unlinkSync, mkdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

export async function generateResearchReportAction(
  topic: string,
  apiKey: string
): Promise<{ data?: ResearchReportResponse; error?: string }> {
  try {
    const data = await generateReportLib(topic, apiKey);
    return { data };
  } catch (error: unknown) {
    console.error("AI Action Error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return { error: msg || "Failed to generate AI research report on server." };
  }
}

/**
 * Computes correct 0G Metadata (Root and Length) for a file.
 * Using a server action allows us to use the Node-only SDK ZgFile safely.
 */
export async function get0GMetadataAction(content: string): Promise<{ data?: { root: string; length: number; nodes: any[] }; error?: string }> {
  const tmpFile = join(tmpdir(), `metadata-${Date.now()}.txt`);
  
  try {
    writeFileSync(tmpFile, content, "utf-8");
    const zgFile = await ZgFile.fromFilePath(tmpFile);
    const [tree, errTree] = await zgFile.merkleTree();
    if (errTree || !tree) return { error: "Failed to build merkle tree" };
    const root = tree.rootHash() || "0x";
    
    const [submission, err] = await zgFile.createSubmission("0x");
    if (err || !submission) return { error: "Failed to create submission" };
    
    return { 
      data: {
        root, 
        length: Number(submission.data.length),
        nodes: submission.data.nodes.map((n: any) => ({
          root: n.root,
          height: Number(n.height)
        }))
      }
    };
  } catch (error: unknown) {
    console.error("0G Metadata Error:", error);
    return { error: "Failed to compute 0G storage metadata." };
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
  txHash: string
): Promise<{ success: boolean; error?: string }> {
  const EVM_RPC = process.env.NEXT_PUBLIC_0G_RPC || "https://evmrpc.0g.ai";
  const INDEXER_RPC = process.env.NEXT_PUBLIC_0G_INDEXER || "https://indexer-storage-turbo.0g.ai";

  console.log("0G NODE UPLOAD: Starting file data upload using txHash:", txHash);

  if (!txHash || !txHash.startsWith("0x")) {
    return { success: false, error: "Valid txHash is required for storage node replication." };
  }

  const tmpFile = join(tmpdir(), `flux-report-${Date.now()}.txt`);
  
  try {
    writeFileSync(tmpFile, content, "utf-8");

    const provider = new ethers.JsonRpcProvider(EVM_RPC);
    // Create a dummy wallet since we are ONLY uploading data, NOT signing on-chain transactions!
    const dummySigner = ethers.Wallet.createRandom(provider);

    const indexer = new Indexer(INDEXER_RPC);
    const zgFile = await ZgFile.fromFilePath(tmpFile);
    const [tree, err] = await zgFile.merkleTree();
    
    if (err || !tree) throw new Error("Failed to compute merkle tree for upload.");

    console.log("0G NODE UPLOAD: Initializing SDK Uploader...");
    const [uploader, initErr] = await indexer.newUploaderFromIndexerNodes(EVM_RPC, dummySigner, 1);
    if (initErr || !uploader) {
      throw new Error(`Failed to init uploader: ${initErr}`);
    }

    console.log("0G NODE UPLOAD: Waiting for on-chain receipt...");
    const receipt = await uploader.waitForReceipt(txHash);
    if (!receipt) {
      throw new Error("Could not find transaction receipt on network.");
    }
    
    const seqs = await uploader.processLogs(receipt);
    if (seqs.length === 0) {
      throw new Error("No Storage txSeq found in transaction logs.");
    }
    const txSeq = seqs[0];
    console.log("0G NODE UPLOAD: Found txSeq:", txSeq);

    console.log("0G NODE UPLOAD: Waiting for storage node log entry sync...");
    const info = await uploader.waitForLogEntry(tree.rootHash(), false, txSeq, true);
    if (!info) {
      throw new Error("Storage node timeout waiting for txSeq sync.");
    }

    console.log("0G NODE UPLOAD: Splitting upload tasks...");
    const tasks = await uploader.splitTasks(info, tree);
    if (!tasks) {
      throw new Error("Failed to split upload tasks.");
    }

    if (tasks.length === 0) {
      console.log("0G NODE UPLOAD: Tasks length 0 — file is already uploaded to nodes!");
      return { success: true };
    }

    console.log(`0G NODE UPLOAD: Uploading ${tasks.length} fragments in parallel...`);
    const results = await uploader.processTasksInParallel(zgFile, tree, tasks);
    console.log("0G NODE UPLOAD: Success! Results:", results);

    return { success: true };
  } catch (error: unknown) {
    console.error("0G NODE UPLOAD: Fatal:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown upload error" };
  } finally {
    try { unlinkSync(tmpFile); } catch (_) {}
  }
}
