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
import Ui from "~/components/ui";
export default function App() {


  return (
    <Ui/>
  );
}
