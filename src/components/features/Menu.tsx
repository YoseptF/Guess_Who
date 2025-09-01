import { Button } from "../ui/Button";
import CharacterSettings from "../ui/CharacterSettings";
import { Input } from "../ui/Input";
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
          <Input
            type="text"
            placeholder="Enter room code"
            value={inputCode}
            onChange={(e) => onInputCodeChange(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button onClick={onJoinRoom}>Join Room</Button>
        </div>
        <div>
          <Button onClick={() => setShowSettings(!showSettings)}>
            {showSettings ? "Hide Settings" : "Settings"}
          </Button>
          {showSettings && <CharacterSettings />}
        </div>
      </div>
    </div>
  );
}
