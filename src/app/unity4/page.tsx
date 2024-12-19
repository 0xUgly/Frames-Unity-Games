"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Unity4Page() {
  const searchParams = useSearchParams();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog("Starting game initialization");
    
    try {
      // Create container
      const container = document.createElement("div");
      container.id = "unity4-container";
      document.body.appendChild(container);
      addLog("Container created ✓");

      // Create iframe
      const iframe = document.createElement("iframe");
      const gamePath = `/unity4-webgl/index.html?${searchParams.toString()}`;
      iframe.src = gamePath;
      addLog(`Game path set to: ${gamePath}`);

      // Set iframe styles
      iframe.style.border = "none";
      iframe.style.width = "100%";
      iframe.style.height = "100vh";
      iframe.style.position = "fixed";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.style.zIndex = "1";
      addLog("Iframe styles set ✓");

      // Add load handlers
      iframe.onload = () => {
        addLog("✅ Game iframe loaded successfully");
      };

      iframe.onerror = () => {
        addLog("❌ Failed to load game iframe");
      };

      // Add iframe to container
      container.appendChild(iframe);
      addLog("Iframe added to page ✓");

    } catch (error) {
      addLog(`❌ Error occurred: ${error}`);
    }

    return () => {
      const container = document.getElementById("unity4-container");
      if (container) {
        document.body.removeChild(container);
        addLog("Cleanup complete ✓");
      }
    };
  }, [searchParams]);

  return (
   <></>
  );
}

export default function UnityPage4() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
        Loading game...
      </div>
    }>
      <Unity4Page />
    </Suspense>
  );
}