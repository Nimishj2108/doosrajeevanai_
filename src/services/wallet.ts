import { ethers } from 'ethers';
import { CHAIN_ID } from './blockchain';

export const connectWallet = async (): Promise<{
  address?: string;
  balance?: string;
  chainId?: number;
  error?: string;
}> => {
  try {
    if (!window.ethereum) {
      return { error: 'MetaMask not installed' };
    }

    await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);

    return {
      address,
      balance: ethers.formatEther(balance),
      chainId: CHAIN_ID,
    };
  } catch (error) {
    console.error('❌ Error connecting wallet:', error);
    return {
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
};

export const switchToAmoyNetwork = async (): Promise<boolean> => {
  try {
    if (!window.ethereum) return false;
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
    });
    return true;
  } catch (error: any) {
    if (error.code === 4902 && window.ethereum) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${CHAIN_ID.toString(16)}`,
            chainName: 'Polygon Amoy',
            rpcUrls: ['https://rpc-amoy.polygon.technology/'],
            nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
            blockExplorerUrls: ['https://www.oklink.com/amoy'],
          },
        ],
      });
      return true;
    }
    return false;
  }
};
