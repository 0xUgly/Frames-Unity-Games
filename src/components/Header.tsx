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
          <Image src="/partners/rl.png" height={30} width={30} alt="" />
        </div>

        {/* Center User Info */}
        <div className="flex flex-col items-center gap-2">
          {/* Profile Picture */}
          <div className="rounded-full m-auto overflow-hidden border-slate-800 border-2 size-16">
            {context?.user.pfpUrl ? (
              <img
                className="object-cover size-full"
                src={context?.user.pfpUrl}
                alt={context?.user.displayName ?? "User Profile Picture"}
                width={50}
                height={50}
              />
            ) : (
              <div className="flex items-center justify-center size-full bg-slate-800 animate-pulse rounded-full" />
            )}
          </div>

          {/* User Display Name */}
          <div className="w-full flex justify-center items-center text-center">
            {context?.user.displayName ? (
              <h1 className="text-md font-bold text-center">{context?.user.displayName}</h1>
            ) : (
              <div className="animate-pulse w-36 m-auto h-8 bg-slate-800 rounded-md" />
            )}
          </div>

          {/* Basename or Wallet Address */}
          {account?.address && (
            <div className="w-full flex justify-center items-center text-center">
              <p className="text-sm text-slate-500">
                <Name address={account.address} chain={base} fallback={shortenAddress(account.address)} />
              </p>
            </div>
          )}

          {/* Display Token Balance Below Address */}
          {tokenBalance !== null && (
            <div className="text-sm text-slate-400">
              Balance: {tokenBalance} XP
            </div>
          )}
        </div>

        {/* Right Logo */}
        <div className="text-xl">
          <Image src="/basenet/BASE LOGO.png" height={30} width={30} alt="" />
        </div>
      </div>
    </>
  );
}

export default Header;
