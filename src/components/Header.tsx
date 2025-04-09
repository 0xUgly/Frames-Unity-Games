"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import { useActiveAccount, useActiveWallet, useConnect } from "thirdweb/react";
import { EIP1193 } from "thirdweb/wallets";
import { ThirdwebClient } from "~/constants";
import { shortenAddress } from "thirdweb/utils";
import { base } from "viem/chains";
import { Name } from "@coinbase/onchainkit/identity";
import { ethers } from "ethers";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://framegames.xyz"; // ✅ Use your custom domain

// **ERC20 Token Contract Details**
const ERC20_ADDRESS = "0x66D51EF7Bc2a1951Cacdb17ff1B458DFec28a2Ef"; // ✅ Replace with your token's contract address
const ERC20_ABI = ["function balanceOf(address owner) view returns (uint256)"];

function Header() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const { connect } = useConnect();
  const wallet = useActiveWallet();
  const account = useActiveAccount();
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    connect(async () => {
      const wallet = EIP1193.fromProvider({
        provider: sdk.wallet.ethProvider,
      });

      await wallet.connect({ client: ThirdwebClient });

      return wallet;
    });
  }, [connect]);

  // **Fetch ERC20 Token Balance**
  const fetchTokenBalance = useCallback(async () => {
    if (!account?.address) return;

    try {
      const provider = new ethers.JsonRpcProvider("https://mainnet.base.org"); // ✅ Base Mainnet RPC
      const contract = new ethers.Contract(ERC20_ADDRESS, ERC20_ABI, provider);
      const balance = await contract.balanceOf(account.address);

      // Convert balance from wei format (assuming 18 decimals)
      const formattedBalance = ethers.formatUnits(balance, 18);
      setTokenBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching token balance:", error);
      setTokenBalance(null);
    }
  }, [account?.address]);

  useEffect(() => {
    const load = async () => {
      try {
        const frameContext = await sdk.context;
        setContext(frameContext);
        sdk.actions.ready({});
      } catch (error) {
        console.error("Error fetching Farcaster context:", error);
      }
    };

    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
      if (sdk.wallet) {
        connectWallet();
      }
    }
  }, [isSDKLoaded, connectWallet]);

  useEffect(() => {
    fetchTokenBalance();
  }, [account?.address, fetchTokenBalance]);

  return (
    <>
      <div className="flex items-center justify-between">
        {/* Left Logo */}
        <div className="text-xl font-bold">
          <Image src="/partners/rl.png" height={50} width={50} alt="" />
        </div>

        <div className="flex items-center gap-4">
          {/* User Details */}
          <div className="text-right">
            {/* Base Name or Wallet Address */}
            {account?.address && (
              <p className="text-sm font-semibold text-slate-300">
                <Name
                  address={account.address as `0x${string}`}
                  chain={base}
                />
              </p>
            )}

            {/* XP Display */}
            {tokenBalance !== null && (
              <p className="text-sm font-bold text-white">
                {tokenBalance}xp
              </p>
            )}
          </div>

          {/* Profile Picture */}
          <div className="overflow-hidden w-12 h-12 rounded-lg border-2 border-foreground">
            {context?.user.pfpUrl ? (
              <img
                src={context?.user.pfpUrl}
                alt={context?.user.displayName ?? "User Profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 animate-pulse" />
            )}
          </div>
        </div>

      </div>
    </>
  );
}

export default Header;
