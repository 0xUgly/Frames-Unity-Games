"use client";
import Ui from "~/components/ui";
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
    <Ui
      isLoading={isLoading}
      selectedGame={selectedGame}
      onGameSelect={handleGameSelect}
    />
  );
};
