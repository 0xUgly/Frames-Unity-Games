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

  const contractAddress = "0x03c4738Ee98aE44591e1A4A4F3CaB6641d95DD9a";
  const rpcUrl = "https://mainnet.base.org";
  const abi = [
    "function name() public pure returns (string memory)",
    "function symbol() public pure returns (string memory)",
    "function tokenURI(uint256 tokenId) public view returns (string)",
    "function balanceOf(address owner) public view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)"
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

      setDebugOutput("Fetching balance...");
      const balance = await contract.balanceOf(account.address);

      if (balance > 0) {
        setDebugOutput(`Balance: ${balance.toString()}`);
        const tokenId = await contract.tokenOfOwnerByIndex(account.address, 0);

        setDebugOutput((prev) => prev + `\nToken ID: ${tokenId}`);
        const tokenURI = await contract.tokenURI(tokenId);

        setDebugOutput((prev) => prev + `\nToken URI: ${tokenURI}`);
        const metadataUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
        const metadataResponse = await fetch(metadataUrl);
        const metadata = await metadataResponse.json();

        setBasename(metadata.name || null);
        setDebugOutput((prev) => prev + `\nMetadata: ${JSON.stringify(metadata)}`);
      } else {
        setDebugOutput("No tokens owned by this wallet.");
        setBasename(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to fetch basename:", error.message);
        setDebugOutput(`Error: ${error.message}`);
      } else {
        console.error("Unknown error occurred:", error);
        setDebugOutput("Unknown error occurred.");
      }
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
