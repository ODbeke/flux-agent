import { ZgFile } from "@0gfoundation/0g-storage-ts-sdk";
import { writeFileSync, unlinkSync } from "fs";

async function main() {
  const content = "x".repeat(8192); // 8KB
  writeFileSync("test_zg.txt", content);
  const zgFile = await ZgFile.fromFilePath("test_zg.txt");
  const [submission, err] = await zgFile.createSubmission("0x");
  if (err) throw err;
  console.log(JSON.stringify(submission, null, 2));
  unlinkSync("test_zg.txt");
}
main().catch(console.error);
