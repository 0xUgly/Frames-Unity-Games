"use client";
import React, { useEffect, useCallback, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import { useActiveAccount, useActiveWallet, useConnect } from "thirdweb/react";
import { EIP1193 } from "thirdweb/wallets";
import { ThirdwebClient } from "~/constants";
import { shortenAddress } from "thirdweb/utils";
import {
  Address,
  createPublicClient,
  encodePacked,
  http,
  keccak256,
} from "viem";
import { base } from "viem/chains";

// **Replace with the actual L2 Resolver contract address**
const BASENAME_L2_RESOLVER_ADDRESS: Address = "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD";

// **Create Public Client for Base Mainnet**
const baseClient = createPublicClient({
  chain: base,
  transport: http(),
});

// **Convert Address to Reverse Node Hash**
function convertReverseNodeToBytes(address: Address): `0x${string}` {
  const reverseNode = `${address.toLowerCase().substring(2)}.addr.reverse`;
  return keccak256(encodePacked(["string"], [reverseNode]));
}

// **Fetch Basename from Resolver Contract**
async function fetchBasenameFromResolver(address: Address): Promise<string | null> {
  try {
    const addressReverseNode: `0x${string}` = convertReverseNodeToBytes(address);
    
    // **Explicitly cast return value as string**
    const basename = (await baseClient.readContract({
      abi: ["function name(bytes32 node) view returns (string)"],
      address: BASENAME_L2_RESOLVER_ADDRESS,
      functionName: "name",
      args: [addressReverseNode],
    })) as string;

    return basename && typeof basename === "string" ? basename : null;
  } catch (error) {
    console.error("Error resolving Basename:", error);
    return null;
  }
}

function Header() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const { connect } = useConnect();
  const wallet = useActiveWallet();
  const account = useActiveAccount();
  const [basename, setBasename] = useState<string | null>(null);
  const [debugOutput, setDebugOutput] = useState<string>("Fetching Basename...");

  const connectWallet = useCallback(async () => {
    connect(async () => {
      const wallet = EIP1193.fromProvider({
        provider: sdk.wallet.ethProvider,
      });

      await wallet.connect({ client: ThirdwebClient });

      return wallet;
    });
  }, [connect]);

  // **Fetch Basename with Resolver**
  const fetchBasename = useCallback(async () => {
    if (!account?.address) {
      setDebugOutput("No active account found.");
      return;
    }

    try {
      const name = await fetchBasenameFromResolver(account.address as Address);
      if (name) {
        setBasename(name);
        setDebugOutput(`Basename found: ${name}`);
      } else {
        setDebugOutput("No Basename found for this address.");
      }
    } catch (error) {
      setDebugOutput(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
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
