"use client";
import Main from "~/components/Main";
import { useState } from "react";

export const ClientPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState("");

  const handleGameSelect = (game: string) => {
    setIsLoading(true);
    setSelectedGame(game);
    // Add your game loading/routing logic here
    setIsLoading(false);
  };

  return (
    <Main
      isLoading={isLoading}
      selectedGame={selectedGame}
      onGameSelect={handleGameSelect}
    />
  );
};
