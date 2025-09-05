import QRCodeReact from "react-qr-code";

interface WaitingProps {
  isHost: boolean;
  roomCode?: string;
}

export default function Waiting({ isHost, roomCode }: WaitingProps) {
  const currentUrl = window.location.origin + window.location.pathname;
  const gameUrl = `${currentUrl}?roomCode=${roomCode}`;

  return (
    <div className="app">
      <h1>Guess Who?</h1>
      <div className="waiting">
        {isHost ? (
          <>
            <h2>Share this code with your friend:</h2>
            <div className="room-code">{roomCode}</div>
            <div className="qr-container">
              <h3>Or scan this QR code:</h3>
              <div>
                <QRCodeReact
                  value={gameUrl}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
            </div>
            <p>Waiting for player to join...</p>
          </>
        ) : (
          <p>Connected! Waiting for game to start...</p>
        )}
      </div>
    </div>
  );
}
