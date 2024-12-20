"use client";
import React, { useState, useEffect } from "react";

import Link from "next/link";
import { motion } from "framer-motion"
import Image from "next/image";
function Footer() {
    const [Active, setActive] = useState("home");
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [comingSoonMessage, setComingSoonMessage] = useState("");
    useEffect(() => {
      if (showComingSoon) {
        const timer = setTimeout(() => setShowComingSoon(false), 3000);
        return () => clearTimeout(timer); // Cleanup the timer on unmount
      }
    }, [showComingSoon]);

  return (
    <>
      {showComingSoon && (
  <motion.div 
    animate={{ y: -20 }} 
    className="absolute bottom-20 left-0 right-0 mx-auto flex items-center justify-center z-20"
  >
    <div className="font-bold text-[15px] bg-black border-2 border-white text-white rounded-[10px] p-2">
      {comingSoonMessage}
    </div>
  </motion.div>
)}


      {/* Bottom Navigation */}
<div className="fixed bottom-0 left-0 right-0  from-black to-transparent pb-4 pt-8 ">
              <div className="mx-auto flex max-w-sm items-center justify-between px-12">
                <button className="text-white/60"
                 onClick={() => {
                    setShowComingSoon(true);
                    setComingSoonMessage("Leaderboard Coming Soon");
                    setActive("chart");
                  }}>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </button>
                <button className="absolute inset-0 flex items-center justify-center mb-10">
                <Image
                src='/footer/HOME.png'
                height={70}
                width={70}
                alt=""
                className=""
                />
                </button>
                <button className="text-white/60"
                onClick={() => {
                    setShowComingSoon(true);
                    setComingSoonMessage("Tasks Coming Soon");
                    setActive("todo");}}>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </button>
              </div>
            </div>



      {/* <div className="fixed z-30 bottom-0 left-0 right-0 flex bg-[url('/footer/bg/grad.png')] bg-center  justify-around border-t-3 border-pink-500/20 bg-transparent px-6 py-5 backdrop-blur w-full">
        <FaHome className="h-6 w-6 text-pink-500/50 cursor-pointer" 
         onClick={() => {
                setShowComingSoon(true);
                setComingSoonMessage("Leaderboard Coming Soon");
                setActive("chart");
              }}
        />
        <FaHome className="h-6 w-6 text-pink-500" />
        <FaHome className="h-6 w-6 text-pink-500/50" 
         onClick={() => {
          setShowComingSoon(true);
          setComingSoonMessage("Tasks Coming Soon");
          setActive("todo");
        }}
        />
      </div> */}
  
    {showComingSoon && (
  <motion.div 
    animate={{ y: -20 }} 
    className="absolute bottom-20 left-0 right-0 mx-auto flex items-center justify-center z-20"
  >
    <div className="font-bold text-[15px] bg-black border-2 border-white text-white rounded-[10px] p-2">
      {comingSoonMessage}
    </div>
  </motion.div>
)}
    </>
  );
}

export default Footer;