import type { PeerData, Character, GamePhase } from './types';

export interface GameData {
  hostChars: Character[];
  guestChars: Character[];
  hostSecret: Character;
  guestSecret: Character;
}

export interface GameHandlers {
  sendData: (data: PeerData) => void;
  setGameAsHost: (characters: Character[], guestSecret: Character) => void;
  initializeGame: () => Promise<GameData | null>;
  setGamePhase: (phase: GamePhase) => void;
  handlePeerData: (data: PeerData) => boolean;
  resetGameState: () => void;
  toggleCrossOut: (
    characterId: number,
    sendData: (data: PeerData) => void,
  ) => void;
}

export const createGameInitializationHandler =
  (handlers: GameHandlers) => async () => {
    const gameData = await handlers.initializeGame();
    if (!gameData) return;

    const { hostChars, guestChars, hostSecret, guestSecret } = gameData;

    handlers.setGameAsHost(hostChars, guestSecret);

    handlers.sendData({
      type: 'gameStart',
      characters: guestChars,
      secret: hostSecret,
    });
    console.debug('Game data sent to guest');

    handlers.setGamePhase('playing');
  };

export const createRoomCreationHandler = (
  handlers: GameHandlers & {
    setIsHost: (isHost: boolean) => void;
    setRoomCode: (code: string) => void;
    createRoom: (
      onRoomCreated: (id: string) => void,
      onPeerConnected: () => void,
      onDataReceived: (data: PeerData) => void,
      onPeerDisconnected: () => void,
      onError: (error: Error) => void,
    ) => void;
  },
) => {
  const handleGameInitialization = createGameInitializationHandler(handlers);

  return () => {
    handlers.setIsHost(true);
    handlers.createRoom(
      (id) => {
        handlers.setRoomCode(id);
        handlers.setGamePhase('waiting');
      },
      handleGameInitialization,
      (data: PeerData) => {
        const handled = handlers.handlePeerData(data);
        if (data.type === 'gameStart' && handled) {
          handlers.setGamePhase('playing');
        }
      },
      () => {
        alert('Player disconnected');
        handlers.setGamePhase('menu');
        handlers.resetGameState();
      },
      (error) => {
        console.error('Connection error:', error);
        if (error.message.includes('network')) {
          alert('Network error. Please check your connection.');
        }
      },
    );
  };
};

export const createRoomJoiningHandler =
  (
    handlers: GameHandlers & {
      setIsHost: (isHost: boolean) => void;
      joinRoom: (
        roomCode: string,
        onConnected: () => void,
        onDataReceived: (data: PeerData) => void,
        onDisconnected: () => void,
        onError: (error: Error) => void,
      ) => void;
    },
  ) =>
  (inputCode: string) => {
    if (!inputCode.trim()) {
      alert('Please enter a room code');
      return;
    }

    handlers.setIsHost(false);
    handlers.joinRoom(
      inputCode,
      () => handlers.setGamePhase('waiting'),
      (data: PeerData) => {
        const handled = handlers.handlePeerData(data);
        if (data.type === 'gameStart' && handled) {
          handlers.setGamePhase('playing');
        }
      },
      () => {
        alert('Disconnected from host');
        handlers.setGamePhase('menu');
        handlers.resetGameState();
      },
      (error) => {
        console.error('Connection error:', error);
        if (error.message.includes('peer-unavailable')) {
          alert('Room not found. Please check the code.');
        } else if (error.message.includes('network')) {
          alert('Network error. Please check your connection.');
        } else {
          alert('Failed to connect. Check the room code and try again.');
        }
        handlers.setGamePhase('menu');
      },
    );
  };

export const createCharacterClickHandler =
  (handlers: Pick<GameHandlers, 'toggleCrossOut' | 'sendData'>) =>
  (characterId: number) => {
    handlers.toggleCrossOut(characterId, handlers.sendData);
  };

export const createGameResetHandler =
  (isHost: boolean, gameInitHandler: () => Promise<void>) => async () => {
    if (!isHost) return;
    await gameInitHandler();
  };
