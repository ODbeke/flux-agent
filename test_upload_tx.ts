import { Indexer, ZgFile } from "@0gfoundation/0g-storage-ts-sdk";
import { ethers } from "ethers";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

async function testUpload() {
  const EVM_RPC = "https://evmrpc.0g.ai";
  const INDEXER_RPC = "https://indexer-storage-turbo.0g.ai";
  const txHash = "0x7baec1c21e64906a2e20b5e284090280ebdbd2524d77759de8a3b839818b7a97"; // From screenshot!
  const content = "Test content for file data upload bypassing Flow submit."; // We don't have the exact markdown but a small text file will do for compiling the script.
  
  const tmpFile = join(tmpdir(), `test-flux-report-${Date.now()}.txt`);
  writeFileSync(tmpFile, content, "utf-8");

  try {
    const provider = new ethers.JsonRpcProvider(EVM_RPC);
    const signer = ethers.Wallet.createRandom(provider); // Dummy signer!

    const indexer = new Indexer(INDEXER_RPC);
    const zgFile = await ZgFile.fromFilePath(tmpFile);
    const [tree, err] = await zgFile.merkleTree();

    console.log("Initializing Uploader...");
    const [uploader, initErr] = await indexer.newUploaderFromIndexerNodes(EVM_RPC, signer, 1);
    if (initErr || !uploader) {
      console.error("Failed to init uploader", initErr);
      return;
    }

    console.log("Waiting for receipt of txHash:", txHash);
    const receipt = await uploader.waitForReceipt(txHash);
    if (!receipt) {
        console.error("Receipt not found");
        return;
    }
    
    const seqs = await uploader.processLogs(receipt);
    if (seqs.length === 0) {
        console.error("No txSeq found in logs");
        return;
    }
    const txSeq = seqs[0];
    console.log("Found txSeq:", txSeq);

    console.log("Waiting for log entry (info)...");
    const info = await uploader.waitForLogEntry(tree.rootHash(), false, txSeq, true);
    if (!info) {
      console.error("Could not find file info for txSeq");
      return;
    }

    console.log("Splitting tasks...");
    const tasks = await uploader.splitTasks(info, tree);
    if (!tasks) {
      console.error("Failed to split tasks");
      return;
    }

    if (tasks.length === 0) {
        console.log("Tasks length 0. Already uploaded?");
        return;
    }

    console.log("Uploading in parallel...", tasks.length, "tasks");
    const results = await uploader.processTasksInParallel(zgFile, tree, tasks);
    console.log("Upload results:", results);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    unlinkSync(tmpFile);
  }
}

testUpload();
