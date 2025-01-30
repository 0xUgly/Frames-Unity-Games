"use client";
import React, { useEffect, useState, useCallback } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import { useActiveAccount, useActiveWallet, useConnect } from "thirdweb/react";
import { EIP1193 } from "thirdweb/wallets";
import { ThirdwebClient } from "~/constants";
import { shortenAddress } from "thirdweb/utils";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";

function Header() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const { connect } = useConnect();
  const wallet = useActiveWallet();
  const account = useActiveAccount();
  const [debugOutput, setDebugOutput] = useState<string>("Fetching Name & Avatar...");

  const connectWallet = useCallback(async () => {
    connect(async () => {
      const wallet = EIP1193.fromProvider({
        provider: sdk.wallet.ethProvider,
      });

      await wallet.connect({ client: ThirdwebClient });

      return wallet;
    });
  }, [connect]);

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

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-bold">Farcaster Header</h1>
      </div>

      {account?.address && (
        <div className="text-center flex flex-col items-center gap-2">
          {/* Coinbase OnchainKit Avatar & Name */}
          <Avatar address={account.address} chain={base} size={50} />
          <Name address={account.address} chain={base} />

          <p className="text-sm">
            {`Wallet Address: ${shortenAddress(account.address)}`}
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
