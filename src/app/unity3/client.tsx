"use client"; // This component runs on the client

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Unity3GameLoader() {
  const searchParams = useSearchParams();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog("Unity3GameLoader mounted");
    
    let container: HTMLDivElement | null = null; // Keep track of the container

    try {
      // Check if we're in the browser
      if (typeof window === 'undefined') {
        addLog("❌ Window not available");
        return;
      }

      addLog("Creating game container...");
      container = document.createElement("div"); // Assign to tracked variable
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
      addLog(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Cleanup function
    return () => {
      addLog("Cleanup starting...");
      try {
        // Use the tracked container variable
        if (container && document.body.contains(container)) {
          document.body.removeChild(container);
          addLog("Cleanup complete ✓");
        } else if (container) {
           addLog("❓ Container found but not in body during cleanup");
        }
         else {
          // Fallback if container wasn't created or tracked properly
          const existingContainer = document.getElementById("unity3-container");
          if (existingContainer) {
             document.body.removeChild(existingContainer);
             addLog("Cleanup complete (fallback) ✓");
          } else {
             addLog("❌ Container not found during cleanup");
          }
        }
      } catch (error) {
        addLog(`❌ Cleanup error: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
  }, [searchParams]); // Dependency array remains the same

  // This component doesn't render anything itself, it just manages the iframe side effect
  return null; 
}

// Export the component that includes Suspense
export default function Unity3ClientComponent() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white z-20">
        Loading Builders Bounce...
      </div>
    }>
      <Unity3GameLoader />
    </Suspense>
  );
}