import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import SettingsDropdown from "../ui/SettingsDropdown";

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
        <SettingsDropdown buttonText="Settings" showIcon={false} />
      </div>
    </div>
  );
}
