import Button from "../ui/Button";
import CharacterSettings from "../ui/CharacterSettings";
import { useState } from "react";

interface MenuProps {
  inputCode: string;
  onInputCodeChange: (code: string) => void;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export default function Menu({
  inputCode,
  onInputCodeChange,
  onCreateRoom,
  onJoinRoom,
}: MenuProps) {
  const [showSettings, setShowSettings] = useState(false);
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onJoinRoom();
    }
  };

  return (
    <div className="app">
      <h1>Guess Who?</h1>
      <div className="menu">
        <Button onClick={onCreateRoom} variant="create">
          Create Room
        </Button>
        <div className="join-section">
          <input
            type="text"
            placeholder="Enter room code"
            value={inputCode}
            onChange={(e) => onInputCodeChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="code-input"
          />
          <Button onClick={onJoinRoom} variant="join">
            Join Room
          </Button>
        </div>
        <div className="settings-section">
          <Button onClick={() => setShowSettings(!showSettings)} variant="join">
            {showSettings ? "Hide Settings" : "Settings"}
          </Button>
          {showSettings && <CharacterSettings />}
        </div>
      </div>
    </div>
  );
}
