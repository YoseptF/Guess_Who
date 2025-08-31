interface WaitingProps {
  isHost: boolean;
  roomCode?: string;
}

export default function Waiting({ isHost, roomCode }: WaitingProps) {
  return (
    <div className="app">
      <h1>Guess Who?</h1>
      <div className="waiting">
        {isHost ? (
          <>
            <h2>Share this code with your friend:</h2>
            <div className="room-code">{roomCode}</div>
            <p>Waiting for player to join...</p>
          </>
        ) : (
          <p>Connected! Waiting for game to start...</p>
        )}
      </div>
    </div>
  );
}
