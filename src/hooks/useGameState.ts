import { useState, useCallback } from "react";
import type { Character, GameState, PeerData } from "../types";
import { useCharacters } from "./useCharacters";
import { useSettings } from "../contexts/SettingsContext";

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    characters: [],
    mySecret: null,
    myCrossedOut: new Set(),
    opponentCrossedOut: new Set(),
  });

  const { fetchCharacters, shuffleArray } = useCharacters();
  const { getEnabledSources } = useSettings();

  const initializeGame = useCallback(async (): Promise<{
    hostChars: Character[];
    guestChars: Character[];
    hostSecret: Character;
    guestSecret: Character;
  } | null> => {
    console.debug("Initializing game...");
    const enabledSources = getEnabledSources();
    const characters = await fetchCharacters(enabledSources);
    if (characters.length === 0) return null;

    const hostSecret =
      characters[Math.floor(Math.random() * characters.length)];
    const guestSecretOptions = characters.filter((c) => c.id !== hostSecret.id);
    const guestSecret =
      guestSecretOptions[Math.floor(Math.random() * guestSecretOptions.length)];

    const hostChars = shuffleArray(characters);
    const guestChars = shuffleArray(characters);

    return {
      hostChars,
      guestChars,
      hostSecret,
      guestSecret,
    };
  }, [fetchCharacters, shuffleArray, getEnabledSources]);

  const setGameAsHost = useCallback(
    (characters: Character[], secret: Character) => {
      setGameState({
        characters,
        mySecret: secret,
        myCrossedOut: new Set(),
        opponentCrossedOut: new Set(),
      });
    },
    [],
  );

  const handlePeerData = useCallback((data: PeerData) => {
    console.debug("Processing data of type:", data.type);

    if (data.type === "gameStart" && data.characters && data.secret) {
      console.debug("Starting game with", data.characters.length, "characters");
      setGameState({
        characters: data.characters,
        mySecret: data.secret,
        myCrossedOut: new Set(),
        opponentCrossedOut: new Set(),
      });
      return true;
    } else if (data.type === "crossOut" && data.crossedOut) {
      console.debug("Updating opponent's crossed out characters");
      setGameState((prev) => ({
        ...prev,
        opponentCrossedOut: new Set(data.crossedOut),
      }));
      return true;
    } else if (data.type === "ready") {
      console.debug("Guest is ready");
      return true;
    }

    return false;
  }, []);

  const toggleCrossOut = useCallback(
    (characterId: number, onSendData?: (data: PeerData) => void) => {
      setGameState((prev) => {
        const newMyCrossedOut = new Set(prev.myCrossedOut);
        if (newMyCrossedOut.has(characterId)) {
          newMyCrossedOut.delete(characterId);
        } else {
          newMyCrossedOut.add(characterId);
        }

        if (onSendData) {
          onSendData({
            type: "crossOut",
            crossedOut: Array.from(newMyCrossedOut),
          });
        }

        return {
          ...prev,
          myCrossedOut: newMyCrossedOut,
        };
      });
    },
    [],
  );

  const resetGameState = useCallback(() => {
    setGameState({
      characters: [],
      mySecret: null,
      myCrossedOut: new Set(),
      opponentCrossedOut: new Set(),
    });
  }, []);

  return {
    gameState,
    initializeGame,
    setGameAsHost,
    handlePeerData,
    toggleCrossOut,
    resetGameState,
  };
};
