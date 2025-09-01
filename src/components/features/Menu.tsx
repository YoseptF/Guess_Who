import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import SettingsDropdown from "../ui/SettingsDropdown";

interface MenuProps {
  inputCode: string;
  onInputCodeChange: (code: string) => void;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  isJoining: boolean;
}

export default function Menu({
  inputCode,
  onInputCodeChange,
  onCreateRoom,
  onJoinRoom,
  isJoining,
}: MenuProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isJoining) {
      onJoinRoom();
    }
  };

  return (
    <div className="app">
      <h1>Guess Who?</h1>
      <div className="menu">
        <div className="flex items-center gap-3">
          <Button onClick={onCreateRoom} variant="outline">
            Create Room
          </Button>
          <SettingsDropdown />
        </div>
        <div className="join-section">
          <Input
            type="text"
            placeholder="Enter room code"
            value={inputCode}
            onChange={(e) => onInputCodeChange(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isJoining}
          />
          <Button onClick={onJoinRoom} loading={isJoining} disabled={isJoining}>
            Join Room
          </Button>
        </div>
      </div>
    </div>
  );
}
