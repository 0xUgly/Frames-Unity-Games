"use client";
import React, { useEffect, useState, useCallback } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import { useActiveAccount, useActiveWallet, useConnect } from "thirdweb/react";
import { EIP1193 } from "thirdweb/wallets";
import { ThirdwebClient } from "~/constants";
import { shortenAddress } from "thirdweb/utils";
import { Name } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";

function Header() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const { connect } = useConnect();
  const wallet = useActiveWallet();
  const account = useActiveAccount();

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
        <div className="text-center">
          {/* Show Basename if available, otherwise show Wallet Address */}
          <Name address={account.address} chain={base} fallback={shortenAddress(account.address)} />
        </div>
      )}
    </div>
  );
}

export default Header;
