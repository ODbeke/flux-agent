const solc = require('solc');
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

async function main() {
  const privateKey = process.argv[2];
  if (!privateKey) {
    console.error("Please provide your private key as an argument:");
    console.error("node deploy.js <YOUR_PRIVATE_KEY>");
    process.exit(1);
  }

  console.log("Compiling FluxAgentAristotle.sol...");
  const contractPath = path.resolve(__dirname, '../contracts/FluxAgentAristotle.sol');
  const sourceCode = fs.readFileSync(contractPath, 'utf8');

  const input = {
    language: 'Solidity',
    sources: {
      'FluxAgentAristotle.sol': {
        content: sourceCode
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  if (output.errors) {
    let hasError = false;
    output.errors.forEach(err => {
      console.log(err.formattedMessage);
      if (err.severity === 'error') hasError = true;
    });
    if (hasError) process.exit(1);
  }

  const contractFile = output.contracts['FluxAgentAristotle.sol']['FluxAgentAristotle'];
  const bytecode = contractFile.evm.bytecode.object;
  const abi = contractFile.abi;

  const EVM_RPC = "https://evmrpc.0g.ai";
  const provider = new ethers.JsonRpcProvider(EVM_RPC);
  const wallet = new ethers.Wallet(privateKey.trim(), provider);

  console.log(`\nDeploying contract using wallet: ${wallet.address}`);
  console.log("Network: 0G Aristotle Mainnet");

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy({ gasLimit: 2000000 });
  
  console.log("Waiting for deployment confirmation...");
  await contract.waitForDeployment();
  
  const deployedAddress = await contract.getAddress();
  console.log(`\n✅ Contract successfully deployed to: ${deployedAddress}`);
  console.log("-------------------------------------------------");
  console.log("Next step:");
  console.log(`1. Copy this address: ${deployedAddress}`);
  console.log("2. Open src/app/dashboard/page.tsx");
  console.log(`3. Update the contractAddress state (around line 150) to use this new address.`);
}

main().catch(console.error);
