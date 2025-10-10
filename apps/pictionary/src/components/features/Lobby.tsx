import { Button } from 'shared-ui';
import QRCode from 'react-qr-code';
import type { Player } from '../../types';

interface LobbyProps {
  isHost: boolean;
  roomCode: string;
  players: Player[];
  myId: string;
  onReady: () => void;
  onStartGame: () => void;
  isReady: boolean;
}

const Lobby = ({
  isHost,
  roomCode,
  players,
  myId,
  onReady,
  onStartGame,
  isReady,
}: LobbyProps) => {
  const allPlayersReady = players.length >= 2 && players.every(p => p.isReady);
  const canStart = isHost && allPlayersReady;

  const currentUrl = window.location.href.split('?')[0];
  const inviteUrl = `${currentUrl}?room=${roomCode}`;

  return (
    <div className="app">
      <h1>🎨 Pictionary</h1>
      <div className="waiting">
        <h2>Room Code:</h2>
        <div className="room-code">{roomCode}</div>

        <div className="qr-container">
          <h3>Scan to Join</h3>
          <div>
            <QRCode
              value={inviteUrl}
              size={200}
              level="M"
            />
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm mt-8 min-w-96">
          <h3 className="text-2xl font-bold text-white text-center mb-4">
            Players ({players.length})
          </h3>
          <div className="space-y-3">
            {players.map(player => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/10"
              >
                <span className="text-lg text-white">
                  {player.name} {player.id === myId && '(You)'}
                </span>
                <span className="text-xl">
                  {player.isReady ? '✅' : '⏳'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          {!isHost && (
            <Button onClick={onReady} size="lg">
              {isReady ? 'Ready! ✓' : 'Mark Ready'}
            </Button>
          )}

          {isHost && (
            <Button
              onClick={onStartGame}
              disabled={!canStart}
              size="lg"
            >
              {canStart
                ? 'Start Game'
                : `Waiting for ${players.length < 2 ? 'players' : 'ready'}`}
            </Button>
          )}
        </div>

        {isHost && players.length < 2 && (
          <p className="text-white/70 mt-4">
            Need at least 2 players to start
          </p>
        )}
      </div>
    </div>
  );
};

export default Lobby;
