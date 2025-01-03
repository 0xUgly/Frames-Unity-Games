// app/unity6/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Unity6Page() {
  const searchParams = useSearchParams();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog("Unity6Page mounted");
    
    try {
      // Check if we're in the browser
      if (typeof window === 'undefined') {
        addLog("❌ Window not available");
        return;
      }

      addLog("Creating game container...");
      const container = document.createElement("div");
      container.id = "unity6-container";
      document.body.appendChild(container);
      addLog("Container created ✓");

      addLog("Setting up game iframe...");
      const iframe = document.createElement("iframe");
      const gamePath = `/unity6-webgl/index.html?${searchParams.toString()}`;
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
        const container = document.getElementById("unity6-container");
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

export default function Unity6WithSuspense() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
        Loading game...
      </div>
    }>
      <Unity6Page />
    </Suspense>
  );
}