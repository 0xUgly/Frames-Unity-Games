import type { Metadata } from "next";
import { ThirdwebProvider } from "thirdweb/react";

import "~/app/globals.css";

export const metadata: Metadata = {
  title: "Rupture Labs FramesV2",
  description: "Unity Based WebGL games based on FramesV2 by Rupture Labs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThirdwebProvider>
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}
