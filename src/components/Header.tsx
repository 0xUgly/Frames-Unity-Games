"use client";
import React, { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { JsonRpcProvider, Contract } from "ethers";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import { useActiveAccount, useActiveWallet, useConnect } from "thirdweb/react";
import { EIP1193 } from "thirdweb/wallets";
import { ThirdwebClient } from "~/constants";
import { shortenAddress } from "thirdweb/utils";

function Header() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const { connect } = useConnect();
  const wallet = useActiveWallet();
  const account = useActiveAccount();
  const [basename, setBasename] = useState<string | null>(null);

  const contractAddress = "0x03c4738Ee98aE44591e1A4A4F3CaB6641d95DD9a";
  const rpcUrl = "https://mainnet.base.org";
  const abi = [
    "function name() public pure returns (string memory)",
    "function symbol() public pure returns (string memory)",
    "function tokenURI(uint256 tokenId) public view returns (string)"
  ];

  const connectWallet = useCallback(async () => {
    connect(async () => {
      const wallet = EIP1193.fromProvider({
        provider: sdk.wallet.ethProvider,
      });

      await wallet.connect({ client: ThirdwebClient });

      return wallet;
    });
  }, [connect]);

  const fetchBasename = useCallback(async () => {
    if (account?.address) {
      try {
        const provider = new JsonRpcProvider(rpcUrl);
        const contract = new Contract(contractAddress, abi, provider);

        // Fetch the number of tokens owned by the wallet
        const balance = await contract.balanceOf(account.address);

        if (balance > 0) {
          // Get the first token ID owned by the wallet
          const tokenId = await contract.tokenOfOwnerByIndex(account.address, 0);

          // Fetch the token URI for the token ID
          const tokenURI = await contract.tokenURI(tokenId);

          // Fetch the metadata from the token URI
          const metadataUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
          const metadataResponse = await fetch(metadataUrl);
          const metadata = await metadataResponse.json();

          setBasename(metadata.name || null);
        } else {
          console.log("No tokens owned by this wallet.");
          setBasename(null);
        }
      } catch (error) {
        console.error("Failed to fetch basename:", error);
        setBasename(null);
      }
    }
  }, [account?.address]);

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready({});
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
    fetchBasename();
  }, [account?.address, fetchBasename]);

  return (
    <div className="flex items-center justify-between">
      <div className="text-xl font-bold">
        <Image
          src="/partners/rl.png"
          height={30}
          width={30}
          alt=""
          className=""
        />
      </div>
      <div className="flex flex-col items-center gap-2">
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
        <div className="w-full flex justify-center items-center text-center">
          {context?.user.displayName ? (
            <h1 className="text-md font-bold text-center">
              {context?.user.displayName}
            </h1>
          ) : (
            <div className="animate-pulse w-36 m-auto h-8 bg-slate-800 rounded-md" />
          )}
        </div>
        {account?.address && (
          <div className="w-full flex justify-center items-center text-center">
            <p className="text-sm text-slate-500">
              {basename ? basename : shortenAddress(account.address)}
            </p>
          </div>
        )}
      </div>
      <div className="text-xl">
        <Image
          src="/basenet/BASE LOGO.png"
          height={30}
          width={30}
          alt=""
          className=""
        />
      </div>
    </div>
  );
}

export default Header;
