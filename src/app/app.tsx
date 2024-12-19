"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  type FrameContext,
} from "@farcaster/frame-sdk";
import { ClientPage } from "./ClientRender";
import { useActiveAccount, useActiveWallet, useConnect } from "thirdweb/react";
import { EIP1193 } from "thirdweb/wallets";
import { ThirdwebClient } from "~/constants";
import { Button } from "~/components/Button";
import { shortenAddress } from "thirdweb/utils";
import { prepareTransaction, sendTransaction } from "thirdweb";
import { base } from "thirdweb/chains";

export default function App() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const { connect } = useConnect();
  const wallet = useActiveWallet();
  const account = useActiveAccount();

  const connectWallet = useCallback(async () => {
    connect(async () => {
      // create a wallet instance from the Warpcast provider
      const wallet = EIP1193.fromProvider({ provider: sdk.wallet.ethProvider });
      
      // trigger the connection
      await wallet.connect({ client: ThirdwebClient });
      
      // return the wallet to the app context
      return wallet;
    })
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
    <main className="bg-slate-900 h-screen w-screen text-white">
    <div className="w-[300px] mx-auto py-4 px-2 pt-32">
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="rounded-full m-auto overflow-hidden border-slate-800 border-2 size-32">
          {context?.user.pfpUrl ? (
            // We intentionally don't use Next's Image here since we can't predict the domain and should not allow any image domain
            // eslint-disable-next-line @next/next/no-img-element
            <img className="object-cover size-full" src={context?.user.pfpUrl} alt={context?.user.displayName ?? "User Profile Picture"} width={100} height={100} />
          ) : (
            <div className="flex items-center justify-center size-full bg-slate-800 animate-pulse rounded-full" />
          )}
        </div>
        <div className="w-full flex justify-center items-center text-center">
          {context?.user.displayName ? <h1 className="text-2xl font-bold text-center">{context?.user.displayName}</h1> : <div className="animate-pulse w-36 m-auto h-8 bg-slate-800 rounded-md" />}
        </div>
        {account?.address && 
          <div className="w-full flex justify-center items-center text-center">
            <p className="text-base text-slate-500">{shortenAddress(account.address)}</p>
          </div>
        }
      </div>

     <ClientPage/>
    </div>
    </main>
  );
}
