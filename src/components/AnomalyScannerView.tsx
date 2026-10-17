import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  ShieldAlert,
  Flame,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Server,
  Activity,
  Lock,
  Unlock,
  Radio,
  Cpu,
  Layers,
  Terminal,
  Database,
  RefreshCw,
  Copy,
  Check,
  Info,
  ChevronRight,
  ChevronDown,
  FileCode2,
  History,
  Clock,
  Fingerprint,
} from 'lucide-react';

// ==========================================
// TYPES & DATA STRUCTURES
// ==========================================

export interface ConsensusNode {
  id: string; // e.g. "NODE-01"
  authorityName: string;
  location: string;
  votingWeight: string; // "11.1%"
  status: 'Healthy' | 'Tampered / Disagree';
  consensus: 'AGREED' | 'REJECTED';
  sigStatus: 'Sig Verified' | 'Invalid Sig';
  latency: string;
  ipAddress: string;
  lastBlockValidated: number;
}

export interface LedgerBlock {
  blockNumber: number;
  hash: string;
  prevHash: string;
  action: string;
  clauseRef: string;
  payloadSummary: string;
  timestamp: string;
  isTampered: boolean;
  signerNode: string;
  gasUsed: string;
  rawPayload: Record<string, any>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  type: 'INFO' | 'WARN' | 'CRITICAL' | 'SUCCESS';
  message: string;
  nodeId?: string;
  hash?: string;
}

export interface NodeAgreementStamp {
  nodeId: string;
  nodeName: string;
  location: string;
  agreedTimestamp: string;
  status: 'AGREED' | 'REJECTED';
  signatureVerified: boolean;
  latency: string;
}

export interface ComputedBlockHistoryItem {
  id: string;
  blockNumber: number;
  hash: string;
  prevHash: string;
  action: string;
  computedAt: string;
  status: 'VERIFIED' | 'TAMPERED' | 'HEALED';
  quorumStatus: string;
  gasUsed: string;
  payloadSummary: string;
  nodeAgreements: NodeAgreementStamp[];
}

// Initial 9-Node Quorum Authority Registry (THOA Statutory Distributed Topology)
const INITIAL_NODES: ConsensusNode[] = [
  {
    id: 'NODE-01',
    authorityName: 'National Central Spine (NOTTO Apex)',
    location: 'New Delhi, DL',
    votingWeight: '11.1%',
    status: 'Healthy',
    consensus: 'AGREED',
    sigStatus: 'Sig Verified',
    latency: '14ms',
    ipAddress: '10.140.1.10 (mTLS v1.3)',
    lastBlockValidated: 14902,
  },
  {
    id: 'NODE-02',
    authorityName: 'AIIMS New Delhi Record Hub',
    location: 'New Delhi, DL',
    votingWeight: '11.1%',
    status: 'Healthy',
    consensus: 'AGREED',
    sigStatus: 'Sig Verified',
    latency: '18ms',
    ipAddress: '10.140.1.22 (mTLS v1.3)',
    lastBlockValidated: 14902,
  },
  {
    id: 'NODE-03',
    authorityName: 'ROTTO Western Authority',
    location: 'Mumbai, MH',
    votingWeight: '11.1%',
    status: 'Healthy',
    consensus: 'AGREED',
    sigStatus: 'Sig Verified',
    latency: '24ms',
    ipAddress: '10.140.2.14 (mTLS v1.3)',
    lastBlockValidated: 14902,
  },
  {
    id: 'NODE-04',
    authorityName: 'SOTTO Southern Apex Node',
    location: 'Chennai, TN',
    votingWeight: '11.1%',
    status: 'Healthy',
    consensus: 'AGREED',
    sigStatus: 'Sig Verified',
    latency: '31ms',
    ipAddress: '10.140.3.08 (mTLS v1.3)',
    lastBlockValidated: 14902,
  },
  {
    id: 'NODE-05',
    authorityName: 'DigiLocker ABHA Gateway Node',
    location: 'Bengaluru, KA',
    votingWeight: '11.1%',
    status: 'Healthy',
    consensus: 'AGREED',
    sigStatus: 'Sig Verified',
    latency: '29ms',
    ipAddress: '10.140.3.45 (mTLS v1.3)',
    lastBlockValidated: 14902,
  },
  {
    id: 'NODE-06',
    authorityName: 'PGIMER Northern Node',
    location: 'Chandigarh, UT',
    votingWeight: '11.1%',
    status: 'Healthy',
    consensus: 'AGREED',
    sigStatus: 'Sig Verified',
    latency: '21ms',
    ipAddress: '10.140.4.19 (mTLS v1.3)',
    lastBlockValidated: 14902,
  },
  {
    id: 'NODE-07',
    authorityName: 'ROTTO Eastern Authority',
    location: 'Kolkata, WB',
    votingWeight: '11.1%',
    status: 'Healthy',
    consensus: 'AGREED',
    sigStatus: 'Sig Verified',
    latency: '36ms',
    ipAddress: '10.140.5.02 (mTLS v1.3)',
    lastBlockValidated: 14902,
  },
  {
    id: 'NODE-08',
    authorityName: 'SOTTO Central Regional Spine',
    location: 'Lucknow, UP',
    votingWeight: '11.1%',
    status: 'Healthy',
    consensus: 'AGREED',
    sigStatus: 'Sig Verified',
    latency: '27ms',
    ipAddress: '10.140.6.11 (mTLS v1.3)',
    lastBlockValidated: 14902,
  },
  {
    id: 'NODE-09',
    authorityName: 'ICMR Bioethics & Audit Authority',
    location: 'Hyderabad, TS',
    votingWeight: '11.1%',
    status: 'Healthy',
    consensus: 'AGREED',
    sigStatus: 'Sig Verified',
    latency: '33ms',
    ipAddress: '10.140.7.88 (mTLS v1.3)',
    lastBlockValidated: 14902,
  },
];

const GENUINE_BLOCK_HASH = '0x8f4b9e27c1a8d0532ff490b81c2d9600e5a31bdf7219c60e4088a21190bc931a';
const TAMPERED_BLOCK_HASH = '0x3e1a0099deadbeef88231140029bcac1194244f0091aa012bad88401beef4110';
const PREV_BLOCK_HASH = '0x5c2d81a9f0e3471b6982cc4a73b9e01f56829141ac9027ef839201b1a0349f82';

// Helper to generate node agreement timestamps for verified blocks
const generateNodeAgreements = (baseTimeOffsetSec: number, overrideMismatch = false): NodeAgreementStamp[] => {
  const baseTime = Date.now() - baseTimeOffsetSec * 1000;
  return INITIAL_NODES.map((node, index) => {
    const nodeOffsetMs = index * 34 + Math.floor(Math.random() * 18);
    const date = new Date(baseTime + nodeOffsetMs);
    const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${(date.getMilliseconds() % 1000)
      .toString()
      .padStart(3, '0')} IST`;

    if (overrideMismatch && (node.id === 'NODE-03' || node.id === 'NODE-05' || node.id === 'NODE-07')) {
      return {
        nodeId: node.id,
        nodeName: node.authorityName,
        location: node.location,
        agreedTimestamp: timeStr,
        status: 'REJECTED',
        signatureVerified: false,
        latency: `${38 + index * 4}ms`,
      };
    }

    return {
      nodeId: node.id,
      nodeName: node.authorityName,
      location: node.location,
      agreedTimestamp: timeStr,
      status: 'AGREED',
      signatureVerified: true,
      latency: node.latency,
    };
  });
};

// Initial 5 computed block hash history items
const INITIAL_HISTORY: ComputedBlockHistoryItem[] = [
  {
    id: 'hist-14902',
    blockNumber: 14902,
    hash: GENUINE_BLOCK_HASH,
    prevHash: PREV_BLOCK_HASH,
    action: 'WAITLIST_SCORE_ALLOCATION',
    computedAt: '12s ago (Active Tip)',
    status: 'VERIFIED',
    quorumStatus: '9/9 Nodes (100% Quorum)',
    gasUsed: '42,108 Gwei',
    payloadSummary: 'Score 98.4 allocated to Recipient #RC-7701 (Pediatric Status I-A, HLA-Match: 6/6)',
    nodeAgreements: generateNodeAgreements(12),
  },
  {
    id: 'hist-14901',
    blockNumber: 14901,
    hash: PREV_BLOCK_HASH,
    prevHash: '0x12a9bc3488f01cde8829910404fa3e9198234857bcae88401918340a1b2c3d4e',
    action: 'DONOR_DECEASED_ENROLLMENT',
    computedAt: '2 mins ago',
    status: 'VERIFIED',
    quorumStatus: '9/9 Nodes (100% Quorum)',
    gasUsed: '51,880 Gwei',
    payloadSummary: 'Cadaveric Donor #DNR-9412 E-Signed via DigiLocker ABHA with Dual Family Consent',
    nodeAgreements: generateNodeAgreements(120),
  },
  {
    id: 'hist-14900',
    blockNumber: 14900,
    hash: '0x12a9bc3488f01cde8829910404fa3e9198234857bcae88401918340a1b2c3d4e',
    prevHash: '0x7e8b91a0c4f82e1d67a9b03f5681c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9',
    action: 'ROTTO_CROSS_STATE_CORRIDOR',
    computedAt: '6 mins ago',
    status: 'VERIFIED',
    quorumStatus: '9/9 Nodes (100% Quorum)',
    gasUsed: '38,400 Gwei',
    payloadSummary: 'Green Corridor Authorized: Mumbai Airport -> Delhi Terminal 3 (Transit Window 4.2h)',
    nodeAgreements: generateNodeAgreements(360),
  },
  {
    id: 'hist-14899',
    blockNumber: 14899,
    hash: '0x7e8b91a0c4f82e1d67a9b03f5681c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9',
    prevHash: '0x44a19c72e901f4a8b7c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1',
    action: 'ORGAN_VIABILITY_TELEMETRY',
    computedAt: '14 mins ago',
    status: 'VERIFIED',
    quorumStatus: '9/9 Nodes (100% Quorum)',
    gasUsed: '29,150 Gwei',
    payloadSummary: 'Perfusion telemetry validated: Cold Ischemia Time at 3.1h, continuous sensor feed verified',
    nodeAgreements: generateNodeAgreements(840),
  },
  {
    id: 'hist-14898',
    blockNumber: 14898,
    hash: '0x44a19c72e901f4a8b7c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1',
    prevHash: '0x99c2d1e0f4a8b7c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a10011',
    action: 'ABHA_CONSENT_MULTISIG',
    computedAt: '28 mins ago',
    status: 'VERIFIED',
    quorumStatus: '9/9 Nodes (100% Quorum)',
    gasUsed: '44,920 Gwei',
    payloadSummary: 'Aadhaar e-KYC multi-party authorization anchored by UIDAI & DigiLocker Gateway',
    nodeAgreements: generateNodeAgreements(1680),
  },
];

const INITIAL_BLOCKS: LedgerBlock[] = [
  {
    blockNumber: 14902,
    hash: GENUINE_BLOCK_HASH,
    prevHash: PREV_BLOCK_HASH,
    action: 'WAITLIST_SCORE_ALLOCATION',
    clauseRef: 'THOA-1994 §8.2(B) - PEDIATRIC_MATCH',
    payloadSummary: 'Score 98.4 allocated to Recipient #RC-7701 (Pediatric Status I-A, HLA-Match: 6/6)',
    timestamp: 'Just now (12s ago)',
    isTampered: false,
    signerNode: 'NODE-01 · NOTTO Apex Primary',
    gasUsed: '42,108 Gwei',
    rawPayload: {
      recipientId: 'RC-7701',
      organ: 'KIDNEY',
      score: 98.4,
      hlaMismatch: 0,
      urgencyTier: 'CRITICAL_1A',
      medicalCenter: 'AIIMS New Delhi',
      consensusProof: 'BFT_ECDSA_9_SIGS_VALID',
    },
  },
  {
    blockNumber: 14901,
    hash: PREV_BLOCK_HASH,
    prevHash: '0x12a9bc3488f01cde8829910404fa3e9198234857bcae88401918340a1b2c3d4e',
    action: 'DONOR_DECEASED_ENROLLMENT',
    clauseRef: 'THOA-1994 §4.1 - FORM_8_CONSENT',
    payloadSummary: 'Cadaveric Donor #DNR-9412 E-Signed via DigiLocker ABHA with Dual Family Consent',
    timestamp: '2 mins ago',
    isTampered: false,
    signerNode: 'NODE-02 · AIIMS New Delhi',
    gasUsed: '51,880 Gwei',
    rawPayload: {
      donorId: 'DNR-9412',
      organs: ['KIDNEY_L', 'KIDNEY_R', 'LIVER', 'CORNEA_2X'],
      abhaVerified: true,
      form8DocHash: '0x9923bbfa...',
    },
  },
  {
    blockNumber: 14900,
    hash: '0x12a9bc3488f01cde8829910404fa3e9198234857bcae88401918340a1b2c3d4e',
    prevHash: '0x7e8b91a0c4f82e1d67a9b03f5681c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9',
    action: 'ROTTO_CROSS_STATE_CORRIDOR',
    clauseRef: 'NOTTO-MANDATE-2024 · GREEN_CORRIDOR_AUTH',
    payloadSummary: 'Green Corridor Authorized: Mumbai Airport -> Delhi Terminal 3 (Transit Window 4.2h)',
    timestamp: '6 mins ago',
    isTampered: false,
    signerNode: 'NODE-03 · ROTTO Western Hub',
    gasUsed: '38,400 Gwei',
    rawPayload: {
      corridorId: 'GC-MUM-DEL-88',
      flightFlightNo: 'AI-882',
      custodyTracker: 'AIRTAG_A2A_SMART_BOX_#09',
    },
  },
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export const AnomalyScannerView: React.FC = () => {
  // State
  const [nodes, setNodes] = useState<ConsensusNode[]>(INITIAL_NODES);
  const [blocks, setBlocks] = useState<LedgerBlock[]>(INITIAL_BLOCKS);
  const [historyItems, setHistoryItems] = useState<ComputedBlockHistoryItem[]>(INITIAL_HISTORY);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>('hist-14902');
  const [isAnomalyDetected, setIsAnomalyDetected] = useState<boolean>(false);
  const [selectedBlock, setSelectedBlock] = useState<LedgerBlock | null>(null);
  const [isHealing, setIsHealing] = useState<boolean>(false);
  const [isAttacking, setIsAttacking] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'danger' | 'info' } | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [healingStep, setHealingStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'nodes' | 'ledger' | 'audit'>('nodes');

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'SUCCESS',
      message: '9/9 BFT Nodes achieved mathematical cryptographic consensus on Block #14,902.',
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 60000).toLocaleTimeString(),
      type: 'INFO',
      message: 'Keccak-256 Merkle root verification passed across all participating state rotto nodes.',
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
      type: 'INFO',
      message: 'Automated mTLS heartbeat check: Zero packet loss, all nodes active with latency < 40ms.',
    },
  ]);

  // Show Toast
  const showToast = (text: string, type: 'success' | 'danger' | 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Copy to clipboard helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // ==========================================
  // ACTION 1: SIMULATE ATTACK / MUTATION
  // ==========================================
  const handleSimulateAttack = () => {
    if (isAnomalyDetected || isAttacking || isHealing) return;

    setIsAttacking(true);

    setTimeout(() => {
      // 1. Invert latest block state
      setBlocks((prevBlocks) =>
        prevBlocks.map((b, idx) =>
          idx === 0
            ? {
                ...b,
                hash: TAMPERED_BLOCK_HASH,
                isTampered: true,
                payloadSummary: '🚨 [UNAUTHORIZED RANK OVERRIDE] Recipient #RC-9999 forced to Rank #1 (VIP Priority Injection)',
                rawPayload: {
                  ...b.rawPayload,
                  recipientId: 'RC-9999-VIP-OVERRIDE',
                  score: 99.9,
                  unauthorizedMutation: true,
                  tamperedField: 'waitlistPriorityRank',
                  compromiseAttempt: 'Keccak-256 state collision attempt via rogue client',
                },
              }
            : b
        )
      );

      // 2. Mark Rogue/Disagreeing Node (Node-03 ROTTO West) and Node-05/07 as detecting anomaly
      setNodes((prevNodes) =>
        prevNodes.map((n) => {
          if (n.id === 'NODE-03' || n.id === 'NODE-05' || n.id === 'NODE-07') {
            return {
              ...n,
              status: 'Tampered / Disagree',
              consensus: 'REJECTED',
              sigStatus: 'Invalid Sig',
            };
          }
          return n;
        })
      );

      // 3. Update computed block hash history with tampered state
      const tamperedAgreements = generateNodeAgreements(0, true);
      const tamperedHistoryItem: ComputedBlockHistoryItem = {
        id: 'hist-14902-tampered',
        blockNumber: 14902,
        hash: TAMPERED_BLOCK_HASH,
        prevHash: PREV_BLOCK_HASH,
        action: 'MUTATION_ATTACK_DETECTED',
        computedAt: 'Just now (Attack Sim)',
        status: 'TAMPERED',
        quorumStatus: '6/9 Quorum (Consensus Violated)',
        gasUsed: '42,108 Gwei (Quarantined)',
        payloadSummary: '🚨 [UNAUTHORIZED RANK OVERRIDE] Recipient #RC-9999 injected into Rank #1',
        nodeAgreements: tamperedAgreements,
      };

      setHistoryItems((prev) => [
        tamperedHistoryItem,
        ...prev.filter((item) => item.id !== 'hist-14902').slice(0, 4),
      ]);
      setExpandedHistoryId('hist-14902-tampered');

      setIsAnomalyDetected(true);
      setIsAttacking(false);

      // Add to audit logs
      setAuditLogs((prev) => [
        {
          id: 'log-' + Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          type: 'CRITICAL',
          message:
            'CRITICAL SECURITY BREACH: Waitlist Rank Mutation detected in Block #14,902! Keccak-256 hash mismatch: Expected 0x8f4b... but found 0x3e1a...',
          nodeId: 'NODE-03',
          hash: TAMPERED_BLOCK_HASH,
        },
        {
          id: 'log-' + (Date.now() + 1),
          timestamp: new Date().toLocaleTimeString(),
          type: 'WARN',
          message: 'BFT Consensus Violated (6/9 valid sigs). Minimum required threshold is 67% (7/9). Ledger state quarantined.',
        },
        ...prev,
      ]);

      showToast('🚨 Vulnerability Test Active: Unauthorized Rank Mutation Detected & Quarantined!', 'danger');
    }, 600);
  };

  // ==========================================
  // ACTION 2: BFT SELF-HEALING RESTORATION
  // ==========================================
  const handleRestoreConsensus = () => {
    if (!isAnomalyDetected || isHealing) return;

    setIsHealing(true);
    setHealingStep(1);

    // Step 1: Recompute cryptographic hash from Genesis
    setTimeout(() => {
      setHealingStep(2);
    }, 800);

    // Step 2: Purge invalid mutated state and sync with 9-node quorum
    setTimeout(() => {
      setHealingStep(3);
    }, 1600);

    // Step 3: Complete Restoration
    setTimeout(() => {
      setBlocks((prevBlocks) =>
        prevBlocks.map((b, idx) =>
          idx === 0
            ? {
                ...b,
                hash: GENUINE_BLOCK_HASH,
                isTampered: false,
                payloadSummary: 'Score 98.4 allocated to Recipient #RC-7701 (Pediatric Status I-A, HLA-Match: 6/6)',
                rawPayload: {
                  recipientId: 'RC-7701',
                  organ: 'KIDNEY',
                  score: 98.4,
                  hlaMismatch: 0,
                  urgencyTier: 'CRITICAL_1A',
                  medicalCenter: 'AIIMS New Delhi',
                  consensusProof: 'BFT_ECDSA_9_SIGS_VALID',
                },
              }
            : b
        )
      );

      setNodes(INITIAL_NODES);

      // Update computed block history with restored healed block
      const healedAgreements = generateNodeAgreements(0, false);
      const healedHistoryItem: ComputedBlockHistoryItem = {
        id: 'hist-14902-healed',
        blockNumber: 14902,
        hash: GENUINE_BLOCK_HASH,
        prevHash: PREV_BLOCK_HASH,
        action: 'BFT_CONSENSUS_RESTORED',
        computedAt: 'Just now (Self-Healed)',
        status: 'HEALED',
        quorumStatus: '9/9 Nodes (100% Consensus Restored)',
        gasUsed: '42,108 Gwei (Verified)',
        payloadSummary: 'Genuine State Restored: Recipient #RC-7701 (Pediatric Score 98.4)',
        nodeAgreements: healedAgreements,
      };

      setHistoryItems((prev) => [
        healedHistoryItem,
        ...prev.filter((item) => !item.id.includes('14902')).slice(0, 4),
      ]);
      setExpandedHistoryId('hist-14902-healed');

      setIsAnomalyDetected(false);
      setIsHealing(false);
      setHealingStep(0);

      // Add to audit logs
      setAuditLogs((prev) => [
        {
          id: 'log-' + Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          type: 'SUCCESS',
          message: 'BFT Self-Healing Complete: Recomputed Keccak-256 hash (0x8f4b...). 9/9 Authority nodes restored 100% agreement.',
          hash: GENUINE_BLOCK_HASH,
        },
        ...prev,
      ]);

      showToast('✅ BFT Consensus Restored: 9/9 Nodes in cryptographic agreement. Ledger 100% secure.', 'success');
    }, 2400);
  };

  const agreedCount = nodes.filter((n) => n.consensus === 'AGREED').length;
  const quorumPercentage = ((agreedCount / nodes.length) * 100).toFixed(1);

  return (
    <div id="anomalyScannerContainer" className="w-full bg-[#f4f6fb] text-[#1A1A1A] font-sans antialiased min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium ${
              toastMessage.type === 'danger'
                ? 'bg-red-950 text-red-100 border-red-700 shadow-red-950/40'
                : toastMessage.type === 'success'
                ? 'bg-emerald-950 text-emerald-100 border-emerald-700 shadow-emerald-950/40'
                : 'bg-[#072945] text-blue-100 border-blue-600 shadow-blue-950/40'
            }`}
          >
            {toastMessage.type === 'danger' ? (
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
            ) : toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-blue-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* ==========================================
            1. HEADER & STATUS BAR
            ========================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#dbe3ee] shadow-sm">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`p-3 rounded-xl transition-colors duration-300 ${
                isAnomalyDetected
                  ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse'
                  : 'bg-blue-50 text-[#0B3D6B] border border-blue-200'
              }`}
            >
              {isAnomalyDetected ? (
                <ShieldAlert className="w-7 h-7 text-red-600 animate-spin-slow" />
              ) : (
                <ShieldCheck className="w-7 h-7 text-[#0B3D6B]" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B3D6B]">
                  Anomaly Scanner & Chain Integrity
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  अखंडता जाँच
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Real-time 9-Node BFT Consensus Quorum · Keccak-256 Merkle Proof & Audit Traceability
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Real-time Status Badge */}
            <div
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all duration-300 ${
                isAnomalyDetected
                  ? 'bg-red-50 text-red-700 border-red-300 shadow-sm shadow-red-100'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isAnomalyDetected ? 'bg-red-600 animate-ping' : 'bg-emerald-600'
                }`}
              />
              {isAnomalyDetected ? (
                <span>Consensus Violated ({agreedCount}/9 Agreed)</span>
              ) : (
                <span>100% Chain Integrity Verified (9/9 Quorum)</span>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700">
              <Database className="w-3.5 h-3.5 text-[#0B3D6B]" />
              <span>Block #{blocks[0].blockNumber}</span>
            </div>
          </div>
        </div>

        {/* ==========================================
            2. HERO DIAGNOSTIC BANNER
            ========================================== */}
        <motion.div
          layout
          className={`relative overflow-hidden rounded-2xl p-6 md:p-8 text-white shadow-xl transition-all duration-500 border ${
            isAnomalyDetected
              ? 'bg-gradient-to-r from-red-950 via-red-900 to-rose-950 border-red-600/80 shadow-red-950/30 ring-2 ring-red-500/20'
              : 'bg-gradient-to-r from-[#0B3D6B] via-[#072945] to-[#1a237e] border-blue-800/60 shadow-blue-950/20'
          }`}
        >
          {/* Subtle background ambient graphic */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full opacity-10 blur-2xl pointer-events-none bg-white" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                    isAnomalyDetected
                      ? 'bg-red-500/20 border-red-400 text-red-200 animate-pulse'
                      : 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                  }`}
                >
                  {isAnomalyDetected ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      CRITICAL SECURITY BREACH DETECTED
                    </>
                  ) : (
                    <>
                      <Radio className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                      BFT CONSENSUS ACTIVE · ZERO TAMPERING
                    </>
                  )}
                </span>

                <span className="text-xs font-mono text-slate-300 bg-black/25 px-2.5 py-1 rounded border border-white/10">
                  Quorum: {quorumPercentage}% ({agreedCount}/9 Nodes)
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                {isAnomalyDetected
                  ? 'Unauthorized Waitlist Mutation Quarantined · Consensus Mismatch'
                  : 'All 9 Independent Authority Nodes Operating in Cryptographic Quorum'}
              </h2>

              <p className="text-sm text-slate-200 leading-relaxed">
                {isAnomalyDetected
                  ? 'A cryptographic Keccak-256 hash mismatch was flagged at Block #14,902. An unauthorized attempt to override patient priority rank was rejected by decentralized verification nodes. The malicious block has been quarantined from the national registry.'
                  : 'Every organ donor enrollment, waitlist scoring event, and cross-state green corridor authorization is continuously verified with Keccak-256 cryptographic hash pointers across 9 autonomous Indian statutory authorities.'}
              </p>

              {isAnomalyDetected && (
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono">
                  <div className="bg-black/40 border border-red-500/40 px-3 py-1.5 rounded-lg text-red-300">
                    <span className="text-slate-400">Mutated Hash: </span>
                    <span className="font-bold">{TAMPERED_BLOCK_HASH.slice(0, 16)}...</span>
                  </div>
                  <div className="bg-black/40 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-emerald-300">
                    <span className="text-slate-400">Genuine Genesis Target: </span>
                    <span className="font-bold">{GENUINE_BLOCK_HASH.slice(0, 16)}...</span>
                  </div>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              {!isAnomalyDetected ? (
                <button
                  type="button"
                  id="btnSimulateVulnerability"
                  onClick={handleSimulateAttack}
                  disabled={isAttacking}
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white shadow-lg shadow-rose-900/30 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isAttacking ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Injecting Payload...
                    </>
                  ) : (
                    <>
                      <Flame className="w-4 h-4 text-amber-200" />
                      Simulate Waitlist Rank Mutation
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  id="btnRestoreConsensus"
                  onClick={handleRestoreConsensus}
                  disabled={isHealing}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-950/40 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isHealing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>
                        {healingStep === 1
                          ? '1/3 Recomputing Keccak-256...'
                          : healingStep === 2
                          ? '2/3 Syncing 9 Authority Nodes...'
                          : '3/3 Restoring BFT State...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4 text-emerald-100" />
                      Restore Consensus (BFT Self-Healing)
                    </>
                  )}
                </button>
              )}

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-300 font-mono">
                <Lock className="w-3.5 h-3.5 text-cyan-300" />
                <span>THOA Section 5 & 8 Audit Protocol</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ==========================================
            3. MAIN CONTENT WITH SCROLLABLE HISTORY SIDEBAR
            ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT 8 COLUMNS: TABS & CORE PANELS */}
          <div className="lg:col-span-8 space-y-4">
            {/* AUDIT TABS (QUORUM NODES / BLOCKS / LOGS) */}
            <div className="flex items-center justify-between border-b border-[#dbe3ee] pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setActiveTab('nodes')}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'nodes'
                      ? 'bg-[#0B3D6B] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  9-Node Distributed Quorum
                </button>
                <button
                  onClick={() => setActiveTab('ledger')}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'ledger'
                      ? 'bg-[#0B3D6B] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  Block Ledger Audit
                </button>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'audit'
                      ? 'bg-[#0B3D6B] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  Live Telemetry ({auditLogs.length})
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono">
                <Cpu className="w-3.5 h-3.5 text-[#0B3D6B]" />
                <span>PBFT-ECDSA</span>
              </div>
            </div>

            {/* TAB CONTENT 1: 9-NODE QUORUM MATRIX (3x3) */}
            {activeTab === 'nodes' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Server className="w-4 h-4 text-[#0B3D6B]" />
                    Distributed Statutory Validator Nodes (3x3 Matrix)
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Threshold: 67% (6/9 Valid Signatures)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {nodes.map((node) => {
                    const isNodeCompromised = node.status === 'Tampered / Disagree';

                    return (
                      <motion.div
                        key={node.id}
                        layout
                        className={`bg-white rounded-xl p-3.5 border transition-all duration-300 shadow-sm relative overflow-hidden ${
                          isNodeCompromised
                            ? 'border-red-400 bg-red-50/40 ring-1 ring-red-400 shadow-red-100'
                            : 'border-[#dbe3ee] hover:border-blue-300'
                        }`}
                      >
                        {/* Top row: Node ID badge + Consensus Chip */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {node.id}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">{node.latency}</span>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono transition-colors ${
                              node.consensus === 'AGREED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
                            }`}
                          >
                            {node.consensus === 'AGREED' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                AGREED
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-3 h-3 text-red-600" />
                                REJECTED
                              </>
                            )}
                          </span>
                        </div>

                        {/* Center: Authority Name + Location */}
                        <div className="space-y-0.5 mb-2.5">
                          <div className="font-bold text-xs text-slate-800 line-clamp-1">
                            {node.authorityName}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center justify-between">
                            <span>{node.location}</span>
                            <span className="font-mono text-slate-400 text-[10px]">{node.ipAddress.split(' ')[0]}</span>
                          </div>
                        </div>

                        {/* Bottom Divider: Voting Weight + Signature Status */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500 font-mono">
                            Weight: <strong className="text-slate-700">{node.votingWeight}</strong>
                          </span>

                          <span
                            className={`font-semibold flex items-center gap-1 font-mono ${
                              node.sigStatus === 'Sig Verified' ? 'text-emerald-700' : 'text-red-700'
                            }`}
                          >
                            {node.sigStatus === 'Sig Verified' ? (
                              <Lock className="w-2.5 h-2.5 text-emerald-600" />
                            ) : (
                              <Unlock className="w-2.5 h-2.5 text-red-600" />
                            )}
                            {node.sigStatus}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: BLOCK LEDGER & MERKLE AUDIT */}
            {activeTab === 'ledger' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#0B3D6B]" />
                    Recent Ledger Blocks & Cryptographic Hash Pointer Audit
                  </h3>
                  <span className="text-xs text-slate-500">Polygon Amoy & State Ledger Nodes</span>
                </div>

                <div className="space-y-3">
                  {blocks.map((block) => {
                    const isBlockCompromised = block.isTampered;

                    return (
                      <div
                        key={block.blockNumber}
                        className={`bg-white rounded-xl p-4 sm:p-5 border transition-all duration-300 ${
                          isBlockCompromised
                            ? 'border-red-400 bg-red-50/20 shadow-md shadow-red-100/50'
                            : 'border-[#dbe3ee] hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="bg-[#0B3D6B] text-white text-xs font-mono font-bold px-2.5 py-1 rounded">
                              Block #{block.blockNumber}
                            </span>
                            <span className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                              {block.action}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">{block.clauseRef}</span>
                          </div>

                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-slate-500">{block.timestamp}</span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] font-mono ${
                                isBlockCompromised
                                  ? 'bg-red-100 text-red-700 border border-red-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {isBlockCompromised ? '🚨 TAMPER DETECTED' : '✅ VERIFIED'}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 font-medium">
                          {block.payloadSummary}
                        </p>

                        {/* Cryptographic Hash Pointers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                          <div className="bg-slate-100 p-2 rounded flex items-center justify-between">
                            <div className="truncate mr-2">
                              <span className="text-slate-400">Current Hash: </span>
                              <span
                                className={`font-semibold ${
                                  isBlockCompromised ? 'text-red-700' : 'text-slate-800'
                                }`}
                              >
                                {block.hash}
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopy(block.hash)}
                              className="text-slate-400 hover:text-slate-700 shrink-0 p-1 cursor-pointer"
                              title="Copy hash"
                            >
                              {copiedHash === block.hash ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          <div className="bg-slate-100 p-2 rounded flex items-center justify-between">
                            <div className="truncate mr-2">
                              <span className="text-slate-400">Prev Hash: </span>
                              <span className="font-semibold text-slate-800">{block.prevHash}</span>
                            </div>
                            <button
                              onClick={() => handleCopy(block.prevHash)}
                              className="text-slate-400 hover:text-slate-700 shrink-0 p-1 cursor-pointer"
                              title="Copy previous hash"
                            >
                              {copiedHash === block.prevHash ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <span>
                            Signer: <strong className="text-slate-700">{block.signerNode}</strong>
                          </span>
                          <button
                            onClick={() => setSelectedBlock(block)}
                            className="text-[#0B3D6B] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            Inspect Raw Payload <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: LIVE TELEMETRY & LOGS */}
            {activeTab === 'audit' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#0B3D6B]" />
                    Cryptographic Consensus Telemetry Feed
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">Stream: WebSocket /rpc-amoy</span>
                </div>

                <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs space-y-2 border border-slate-800 shadow-inner max-h-96 overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2.5 border-b border-slate-800/60 pb-2">
                      <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                      <span
                        className={`font-bold shrink-0 px-1.5 py-0.2 rounded text-[10px] ${
                          log.type === 'CRITICAL'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : log.type === 'WARN'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : log.type === 'SUCCESS'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-blue-950 text-blue-400 border border-blue-800'
                        }`}
                      >
                        {log.type}
                      </span>
                      <span className="text-slate-300 flex-1 leading-relaxed">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT 4 COLUMNS: SCROLLABLE HISTORY SIDEBAR (LAST 5 COMPUTED BLOCK HASHES & NODE AGREEMENT TIMESTAMPS) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white rounded-2xl border border-[#dbe3ee] p-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-50 text-[#0B3D6B] border border-blue-100">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                      Block Hash Audit History
                    </h3>
                    <p className="text-[11px] text-slate-500">Last 5 Computed Blocks & Quorum</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-[#0B3D6B] border border-slate-200">
                  5 Computed
                </span>
              </div>

              {/* Scrollable Container */}
              <div className="mt-3 space-y-3 max-h-[640px] overflow-y-auto pr-1">
                {historyItems.map((item, index) => {
                  const isExpanded = expandedHistoryId === item.id;
                  const isTampered = item.status === 'TAMPERED';
                  const isHealed = item.status === 'HEALED';

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      className={`rounded-xl border p-3 transition-all text-xs font-sans ${
                        isTampered
                          ? 'border-red-300 bg-red-50/50 shadow-xs'
                          : isHealed
                          ? 'border-emerald-300 bg-emerald-50/40 shadow-xs'
                          : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                      }`}
                    >
                      {/* Top Row: Block Number + Status + Expand Button */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                              isTampered
                                ? 'bg-red-900 text-white'
                                : isHealed
                                ? 'bg-emerald-800 text-white'
                                : 'bg-[#0B3D6B] text-white'
                            }`}
                          >
                            #{item.blockNumber}
                          </span>
                          <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {item.computedAt}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                            isTampered
                              ? 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
                              : isHealed
                              ? 'bg-teal-100 text-teal-800 border border-teal-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      {/* Action Tag & Brief Summary */}
                      <div className="mb-2">
                        <div className="font-bold text-[11px] text-slate-800 truncate">
                          {item.action}
                        </div>
                        <div className="text-[10px] text-slate-600 line-clamp-1 mt-0.5">
                          {item.payloadSummary}
                        </div>
                      </div>

                      {/* Computed Keccak-256 Hash */}
                      <div className="bg-white p-2 rounded-lg border border-slate-200/80 mb-2 font-mono text-[11px] flex items-center justify-between gap-2 shadow-xs">
                        <div className="truncate">
                          <span className="text-slate-400 text-[10px] block">Keccak-256 Hash:</span>
                          <span
                            className={`font-semibold text-[11px] truncate block ${
                              isTampered ? 'text-red-700 font-bold' : 'text-slate-800'
                            }`}
                          >
                            {item.hash.slice(0, 10)}...{item.hash.slice(-8)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(item.hash)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                          title="Copy Full Block Hash"
                        >
                          {copiedHash === item.hash ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Quorum Summary & Toggle Node Agreement Timestamps */}
                      <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span
                          className={`font-mono font-medium text-[10px] ${
                            isTampered ? 'text-red-700' : 'text-slate-600'
                          }`}
                        >
                          {item.quorumStatus}
                        </span>

                        <button
                          onClick={() =>
                            setExpandedHistoryId(isExpanded ? null : item.id)
                          }
                          className="text-[#0B3D6B] font-semibold text-[10px] flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          {isExpanded ? 'Hide Node Timestamps' : 'Node Agreement (9)'}
                          {isExpanded ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      {/* Expanded Node Agreement Timestamps List */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2.5 pt-2 border-t border-slate-200/80 space-y-1.5 overflow-hidden"
                          >
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                              <span>Node Authority Consensus Timestamps</span>
                              <span>Sig Audit</span>
                            </div>

                            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 font-mono text-[10px]">
                              {item.nodeAgreements.map((agreement) => {
                                const isNodeRejected = agreement.status === 'REJECTED';
                                return (
                                  <div
                                    key={agreement.nodeId}
                                    className={`p-1.5 rounded flex items-center justify-between border ${
                                      isNodeRejected
                                        ? 'bg-red-100/70 border-red-300 text-red-900'
                                        : 'bg-white border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    <div className="truncate mr-2">
                                      <div className="font-bold flex items-center gap-1">
                                        <span>{agreement.nodeId}</span>
                                        <span className="text-[9px] font-normal text-slate-500 truncate">
                                          ({agreement.location.split(',')[0]})
                                        </span>
                                      </div>
                                      <div className="text-[9px] text-slate-500">
                                        {agreement.agreedTimestamp}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                      <span
                                        className={`font-bold px-1.5 py-0.2 rounded text-[9px] ${
                                          isNodeRejected
                                            ? 'bg-red-700 text-white'
                                            : 'bg-emerald-100 text-emerald-800'
                                        }`}
                                      >
                                        {agreement.status}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Audit Traceability Reference Note */}
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 text-[11px] text-[#072945] flex items-start gap-2">
              <Fingerprint className="w-4 h-4 text-[#0B3D6B] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                All 9 node consensus timestamps are cryptographically anchored to Indian Standard Time (IST) NTP synchronized clock servers with sub-millisecond multi-signature consensus.
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            RAW BLOCK PAYLOAD MODAL
            ========================================== */}
        {selectedBlock && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl max-w-2xl w-full border border-slate-300 shadow-2xl overflow-hidden"
            >
              <div className="bg-[#0B3D6B] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-cyan-300" />
                  <span className="font-bold text-sm">
                    Raw Block Payload Inspection · Block #{selectedBlock.blockNumber}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedBlock(null)}
                  className="text-white/80 hover:text-white text-lg font-bold px-2 py-0.5 rounded hover:bg-white/10 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto font-mono text-xs">
                <div className="bg-slate-100 p-3 rounded-lg space-y-1">
                  <div>
                    <span className="text-slate-500">Action:</span> <strong>{selectedBlock.action}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Clause Reference:</span>{' '}
                    <strong>{selectedBlock.clauseRef}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Hash:</span> <strong>{selectedBlock.hash}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Gas Used:</span> {selectedBlock.gasUsed}
                  </div>
                </div>

                <div>
                  <label className="text-slate-500 text-[11px] font-bold uppercase block mb-1">
                    State Payload JSON (Keccak-256 Merkle Proof Leaf)
                  </label>
                  <pre className="bg-slate-900 text-emerald-400 p-3.5 rounded-lg overflow-x-auto text-[11px]">
                    {JSON.stringify(selectedBlock.rawPayload, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSelectedBlock(null)}
                  className="px-4 py-2 rounded-lg bg-[#0B3D6B] text-white font-semibold text-xs hover:bg-[#072945] cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnomalyScannerView;
