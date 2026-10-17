import { useEffect, useState } from 'react';
import { 
  getChainLength, 
  getLatestBlockHash, 
  verifyChainIntegrity 
} from './services/blockchain';
import { connectWallet, switchToAmoyNetwork } from './services/wallet';
import { AnomalyScannerView } from './components/AnomalyScannerView';
import { ShieldCheck, Wallet, Database, Layers, Radio } from 'lucide-react';

export default function App() {
  const [chainLength, setChainLength] = useState(14902);
  const [latestHash, setLatestHash] = useState('0x8f4b9e27c1a8d0532ff490b81c2d9600e5a31bdf7219c60e4088a21190bc931a');
  const [isIntegrityValid, setIsIntegrityValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        setLoading(true);
        const length = await getChainLength();
        if (length > 0) {
          setChainLength(length);
        }

        const hash = await getLatestBlockHash();
        if (hash) {
          setLatestHash(hash);
        }

        const isValid = await verifyChainIntegrity();
        setIsIntegrityValid(isValid);
      } catch (err) {
        console.warn('Fallback to local ledger simulation:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBlockchainData();
  }, []);

  const handleConnectWallet = async () => {
    await switchToAmoyNetwork();
    const res = await connectWallet();
    if (res.address) {
      setWalletAddress(res.address);
      setWalletBalance(res.balance || '0');
    } else {
      alert(res.error || 'Failed to connect wallet');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1A1A1A]">
      {/* Top Institutional Header */}
      <header className="bg-[#072945] text-white py-2 px-4 text-xs font-mono border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded text-[11px] font-bold">
              POLYGON AMOY TESTNET
            </span>
            <span className="text-slate-300 hidden sm:inline">Chain ID: 80002 · RPC Live</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">NOTTO Section 8.2 Audit Protocol</span>
            <span className="text-amber-300 font-bold">9-Node Quorum Active</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation / Top App Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#D9DEE4] shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0B3D6B]">Doosra Jeevan (दूसरा जीवन)</h1>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                PROTOTYPE
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              National Organ Transplant Blockchain Registry & AI Allocation Platform
            </p>
          </div>

          <div className="flex items-center gap-3">
            {walletAddress ? (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-800 px-3.5 py-2 rounded-xl text-xs font-mono font-medium shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
                <span className="text-slate-400">|</span>
                <span>{Number(walletBalance || 0).toFixed(3)} MATIC</span>
              </div>
            ) : (
              <button 
                type="button"
                onClick={handleConnectWallet}
                className="inline-flex items-center gap-2 bg-[#0B3D6B] hover:bg-[#072945] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Wallet className="w-4 h-4 text-amber-400" />
                Connect MetaMask (Amoy)
              </button>
            )}
          </div>
        </div>

        {/* Anomaly Scanner Component */}
        <AnomalyScannerView />
      </div>
    </div>
  );
}
