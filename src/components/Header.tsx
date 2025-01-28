"use client";
import React, { useEffect, useCallback, useState } from "react";
import { JsonRpcProvider, Contract } from "ethers";
import { useActiveAccount, useActiveWallet, useConnect } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";

function Header() {
  const [basename, setBasename] = useState<string | null>(null);
  const [debugOutput, setDebugOutput] = useState<string>(""); // For debugging
  const account = useActiveAccount();

  // Contract and Provider Details
  const contractAddress = "0x03c4738Ee98aE44591e1A4A4F3CaB6641d95DD9a";
  const rpcUrl = "https://mainnet.base.org";
  const abi = [
    "function balanceOf(address owner) public view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
    "function tokenURI(uint256 tokenId) public view returns (string)"
  ];

  const fetchBasename = useCallback(async () => {
    if (!account?.address) {
      setDebugOutput("No active account found.");
      return;
    }

    try {
      const provider = new JsonRpcProvider(rpcUrl);
      const contract = new Contract(contractAddress, abi, provider);

      setDebugOutput("Fetching balance...");
      const balance = await contract.balanceOf(account.address);

      if (balance.toString() === "0") {
        setDebugOutput("No tokens owned by this wallet.");
        setBasename(null);
        return;
      }

      // Fetch the first token ID
      setDebugOutput((prev) => prev + `\nBalance: ${balance.toString()}`);
      const tokenId = await contract.tokenOfOwnerByIndex(account.address, 0);

      // Fetch the token URI
      setDebugOutput((prev) => prev + `\nToken ID: ${tokenId.toString()}`);
      const tokenURI = await contract.tokenURI(tokenId);

      // Fetch metadata from the token URI
      const metadataUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const metadataResponse = await fetch(metadataUrl);
      const metadata = await metadataResponse.json();

      setBasename(metadata.name || null);
      setDebugOutput((prev) => prev + `\nMetadata: ${JSON.stringify(metadata)}`);
    } catch (error) {
      if (error instanceof Error) {
        setDebugOutput(`Error: ${error.message}`);
      } else {
        setDebugOutput("Unknown error occurred.");
      }
    }
  }, [account?.address]);

  useEffect(() => {
    fetchBasename();
  }, [fetchBasename]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-center">
        {account?.address ? (
          <p className="text-sm">
            {basename
              ? `Basename: ${basename}`
              : `Address: ${shortenAddress(account.address)}`}
          </p>
        ) : (
          <p>No active account connected.</p>
        )}
      </div>
      <div className="bg-gray-100 p-4 mt-4 rounded w-full">
        <h2 className="text-md font-bold">Debug Output</h2>
        <pre className="text-sm whitespace-pre-wrap">{debugOutput}</pre>
      </div>
    </div>
  );
}

export default Header;
