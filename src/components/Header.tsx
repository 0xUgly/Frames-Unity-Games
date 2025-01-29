"use client";
import React, { useEffect, useCallback, useState } from "react";
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
  const [debugOutput, setDebugOutput] = useState<string>(""); // For debugging

  // Base Mainnet Contract & RPC Details
  const contractAddress = "0x03c4738Ee98aE44591e1A4A4F3CaB6641d95DD9a";
  const rpcUrl = "https://mainnet.base.org";

  // Updated Contract ABI based on provided ABI
  const abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function tokenURI(uint256 tokenId) view returns (string)"
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
    if (!account?.address) {
      setDebugOutput("No active account found.");
      return;
    }
  
    try {
      const provider = new JsonRpcProvider(rpcUrl);
      const contract = new Contract(contractAddress, abi, provider);
  
      // Step 1: Get balance
      const balance: bigint = await contract.balanceOf(account.address);
      setDebugOutput(`Balance: ${balance.toString()}`);
  
      if (balance === 0n) {
        setDebugOutput("No tokens owned by this wallet.");
        setBasename(null);
        return;
      }
  
      // Step 2: Try finding a valid token owned by the user
      let tokenId: number | undefined;
      for (let i = 0; i < Number(balance); i++) {
        try {
          const testTokenId = i;
          const owner: string = await contract.ownerOf(testTokenId);
          if (owner.toLowerCase() === account.address.toLowerCase()) {
            tokenId = testTokenId;
            break;
          }
        } catch (err) {
          continue;
        }
      }
  
      if (tokenId === undefined) {
        setDebugOutput("No valid token found for this wallet.");
        return;
      }
  
      setDebugOutput((prev) => prev + `\nToken ID: ${tokenId}`);
  
      // Step 3: Fetch token URI
      let tokenURI: string = "";
      try {
        tokenURI = await contract.tokenURI(tokenId);
        setDebugOutput((prev) => prev + `\nToken URI: ${tokenURI}`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        setDebugOutput((prev) => prev + `\nError fetching token URI: ${errorMsg}`);
        return;
      }
  
      // Step 4: Fetch metadata
      try {
        const metadataUrl: string = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
        const metadataResponse: Response = await fetch(metadataUrl);
        const metadata: { name?: string } = await metadataResponse.json();
  
        setBasename(metadata.name || null);
        setDebugOutput((prev) => prev + `\nMetadata: ${JSON.stringify(metadata)}`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        setDebugOutput((prev) => prev + `\nError fetching metadata: ${errorMsg}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setDebugOutput(`Error: ${errorMsg}`);
    }
  }, [account?.address, abi]); // ✅ Fix: Include abi in the dependency array
  
  
  

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
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-bold">Farcaster Header</h1>
      </div>
      {account?.address && (
        <div className="text-center">
          <p className="text-sm">
            {basename ? `Basename: ${basename}` : `Address: ${shortenAddress(account.address)}`}
          </p>
        </div>
      )}
      <div className="bg-gray-100 p-4 mt-4 rounded w-full">
        <h2 className="text-md font-bold">Debug Output</h2>
        <pre className="text-sm whitespace-pre-wrap">{debugOutput}</pre>
      </div>
    </div>
  );
}

export default Header;
