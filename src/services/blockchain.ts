import { ethers } from 'ethers';

// ✅ Environment से Values लो, या default use करो
export const AMOY_RPC = import.meta.env.VITE_AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology/';

export const CONTRACTS = {
  DOOSRA_LEDGER: import.meta.env.VITE_DOOSRA_LEDGER_ADDRESS || '0xF4718BfcD0Ccf2ba3888A2a20c8EB6E936Ab3E1a',
  PATIENT_TOKEN: import.meta.env.VITE_PATIENT_TOKEN_ADDRESS || '0x23A7D2D9A8eef261811721106Ab5d271549A1d3B',
};

export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID) || 80002;

console.log('🔧 Blockchain Configuration Loaded:');
console.log(`   ✅ RPC: ${AMOY_RPC}`);
console.log(`   ✅ Ledger Contract: ${CONTRACTS.DOOSRA_LEDGER}`);
console.log(`   ✅ Patient Token Contract: ${CONTRACTS.PATIENT_TOKEN}`);
console.log(`   ✅ Chain ID: ${CHAIN_ID}`);

// ✅ DoosraLedger ABI
export const DOOSRA_LEDGER_ABI = [
  {
    "inputs": [],
    "name": "chainLength",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "bytes32", "name": "dataHash", "type": "bytes32"},
      {"internalType": "string", "name": "action", "type": "string"},
      {"internalType": "string", "name": "clauseRef", "type": "string"}
    ],
    "name": "appendBlock",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "latestHash",
    "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "verifyIntegrity",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "index", "type": "uint256"}],
    "name": "getBlock",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "blockNumber", "type": "uint256"},
          {"internalType": "bytes32", "name": "prevHash", "type": "bytes32"},
          {"internalType": "bytes32", "name": "currHash", "type": "bytes32"},
          {"internalType": "string", "name": "action", "type": "string"},
          {"internalType": "string", "name": "clauseRef", "type": "string"},
          {"internalType": "address", "name": "submittedBy", "type": "address"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "internalType": "struct DoosraLedger.Block",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// ✅ PatientIdentityToken ABI
export const PATIENT_TOKEN_ABI = [
  {
    "inputs": [
      {"internalType": "bytes32", "name": "identityHash", "type": "bytes32"}
    ],
    "name": "isRegistered",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "bytes32", "name": "identityHash", "type": "bytes32"}
    ],
    "name": "mintPatientToken",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// ✅ Initialize Provider (Read-Only)
export const getProvider = () => {
  return new ethers.JsonRpcProvider(AMOY_RPC);
};

// ✅ Initialize Ledger Contract
export const getLedgerContract = () => {
  const provider = getProvider();
  return new ethers.Contract(
    CONTRACTS.DOOSRA_LEDGER,
    DOOSRA_LEDGER_ABI,
    provider
  );
};

// ✅ Initialize Patient Token Contract
export const getPatientTokenContract = () => {
  const provider = getProvider();
  return new ethers.Contract(
    CONTRACTS.PATIENT_TOKEN,
    PATIENT_TOKEN_ABI,
    provider
  );
};

// ✅ Get Chain Length
export const getChainLength = async (): Promise<number> => {
  try {
    const contract = getLedgerContract();
    const length = await contract.chainLength();
    return Number(length);
  } catch (error) {
    console.error('❌ Error fetching chain length:', error);
    return 0;
  }
};

// ✅ Get Latest Block Hash
export const getLatestBlockHash = async (): Promise<string> => {
  try {
    const contract = getLedgerContract();
    const hash = await contract.latestHash();
    return hash;
  } catch (error) {
    console.error('❌ Error fetching latest hash:', error);
    return '';
  }
};

// ✅ Verify Chain Integrity
export const verifyChainIntegrity = async (): Promise<boolean> => {
  try {
    const contract = getLedgerContract();
    const isValid = await contract.verifyIntegrity();
    return isValid;
  } catch (error) {
    console.error('❌ Error verifying integrity:', error);
    return false;
  }
};

// ✅ Get Full Block Data
export const getBlockData = async (blockIndex: number) => {
  try {
    const contract = getLedgerContract();
    const blockData = await contract.getBlock(blockIndex);
    return {
      blockNumber: Number(blockData.blockNumber),
      prevHash: blockData.prevHash,
      currHash: blockData.currHash,
      action: blockData.action,
      clauseRef: blockData.clauseRef,
      submittedBy: blockData.submittedBy,
      timestamp: Number(blockData.timestamp),
    };
  } catch (error) {
    console.error('❌ Error fetching block:', error);
    return null;
  }
};

// ✅ Check if Patient Registered
export const isPatientRegistered = async (identityHash: string): Promise<boolean> => {
  try {
    const contract = getPatientTokenContract();
    const isReg = await contract.isRegistered(identityHash);
    return isReg;
  } catch (error) {
    console.error('❌ Error checking patient registration:', error);
    return false;
  }
};