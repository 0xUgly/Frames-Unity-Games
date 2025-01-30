"use client";
import React, { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import { useActiveAccount, useActiveWallet, useConnect } from "thirdweb/react";
import { EIP1193 } from "thirdweb/wallets";
import { ThirdwebClient } from "~/constants";
import { shortenAddress } from "thirdweb/utils";
import { base } from "thirdweb/chains";
import { Name } from "@coinbase/onchainkit/identity";

function Header() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const { connect } = useConnect();
  const wallet = useActiveWallet();
  const account = useActiveAccount();

  const connectWallet = useCallback(async () => {
    connect(async () => {
      // Create a wallet instance from the Warpcast provider
      const wallet = EIP1193.fromProvider({ provider: sdk.wallet.ethProvider });

      // Trigger the connection
      await wallet.connect({ client: ThirdwebClient });

      // Return the wallet to the app context
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
              // We intentionally don't use Next.js' Image here since we can't predict the domain
              // eslint-disable-next-line @next/next/no-img-element
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

          {/* Basename or Wallet Address (Shows only one) */}
          {account?.address && (
            <div className="w-full flex justify-center items-center text-center">
              <p className="text-sm text-slate-500">
                <Name address={account.address} chain={base} fallback={shortenAddress(account.address)} />
              </p>
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
