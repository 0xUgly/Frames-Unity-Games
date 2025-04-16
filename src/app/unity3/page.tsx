import { Metadata } from "next"; // Import Metadata type

const appUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"; // Ensure appUrl is defined
const gameName = "Builders Bounce"; // Game specific info
const gameImageUrl = `${appUrl}/gameimg/buildersbounce.png`; // Game specific image
const gameRoute = "/unity3"; // Game specific route

// Define the frame metadata for this specific game page
const frame = {
  version: "next",
  imageUrl: gameImageUrl,
  button: {
    title: `Play ${gameName}`,
    action: {
      type: "launch_frame",
      name: `Play ${gameName}`, // Frame name
      url: `${appUrl}${gameRoute}`, // URL to launch directly into this game
      splashImageUrl: `${appUrl}/splash.png`, // Use the general splash
      splashBackgroundColor: "#0f172a",
    },
  },
};

// Export generateMetadata function
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: gameName, // Set page title
    openGraph: {
      title: gameName,
      description: `Play ${gameName} on Farcaster!`,
      images: [gameImageUrl],
    },
    other: {
      "fc:frame": JSON.stringify(frame), // Add the frame metadata
    },
  };
}

// Existing code below...
// app/unity3/page.tsx // Corrected comment
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Unity3Page() {
  const searchParams = useSearchParams();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog("Unity3Page mounted");
    
    try {
      // Check if we're in the browser
      if (typeof window === 'undefined') {
        addLog("❌ Window not available");
        return;
      }

      addLog("Creating game container...");
      const container = document.createElement("div");
      container.id = "unity3-container";
      document.body.appendChild(container);
      addLog("Container created ✓");

      addLog("Setting up game iframe...");
      const iframe = document.createElement("iframe");
      const gamePath = `/unity3-webgl/index.html?${searchParams.toString()}`;
      iframe.src = gamePath;
      addLog(`Game path set to: ${gamePath}`);

      iframe.style.border = "none";
      iframe.style.width = "100%";
      iframe.style.height = "100vh";
      iframe.style.position = "fixed";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.style.zIndex = "1";
      addLog("Iframe styles applied ✓");

      iframe.onload = () => {
        addLog("✅ Game iframe loaded successfully");
      };

      iframe.onerror = () => {
        addLog("❌ Failed to load game iframe");
      };

      container.appendChild(iframe);
      addLog("Iframe added to container ✓");

    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }

    return () => {
      addLog("Cleanup starting...");
      try {
        const container = document.getElementById("unity3-container");
        if (container) {
          document.body.removeChild(container);
          addLog("Cleanup complete ✓");
        } else {
          addLog("❌ Container not found during cleanup");
        }
      } catch (error) {
        addLog(`❌ Cleanup error: ${error}`);
      }
    };
  }, [searchParams]);

  return (
<></>
  );
}

export default function Unity3WithSuspense() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
        Loading game...
      </div>
    }>
      <Unity3Page />
    </Suspense>
  );
}