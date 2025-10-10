import { useState } from 'react';
import { Button, Input } from 'shared-ui';
import { useSettings } from '../../contexts/SettingsContext';
import { wordProviders } from '../../providers';

interface MenuProps {
  inputCode: string;
  onInputCodeChange: (code: string) => void;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  isJoining: boolean;
}

const Menu = ({
  inputCode,
  onInputCodeChange,
  onCreateRoom,
  onJoinRoom,
  isJoining,
}: MenuProps) => {
  const { wordProviderSettings, updateWordProvider, timerDuration, setTimerDuration } = useSettings();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="app">
      <h1>🎨 Pictionary</h1>
      <div className="menu">
        <Button onClick={onCreateRoom} size="lg">
          Create Room
        </Button>

        <div className="join-section">
          <Input
            type="text"
            value={inputCode}
            onChange={e => onInputCodeChange(e.target.value.toLowerCase())}
            placeholder="Enter room code"
            className="code-input"
          />
          <Button
            onClick={onJoinRoom}
            disabled={!inputCode || isJoining}
            size="lg"
          >
            {isJoining ? 'Joining...' : 'Join Room'}
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={() => setShowSettings(!showSettings)}
          size="lg"
        >
          {showSettings ? 'Hide Settings' : 'Show Settings'}
        </Button>

        {showSettings && (
          <div className="character-settings">
            <h3>Word Providers</h3>
            <div className="settings-grid">
              {wordProviders.map(provider => (
                <label key={provider.name} className="setting-item">
                  <input
                    type="checkbox"
                    checked={wordProviderSettings[provider.name] || false}
                    onChange={e =>
                      updateWordProvider(provider.name, e.target.checked)
                    }
                  />
                  <span>{provider.name}</span>
                </label>
              ))}
            </div>

            <h3 className="mt-6">Timer Duration</h3>
            <div className="flex gap-4 justify-center">
              {[30, 60, 120, 180].map(duration => (
                <Button
                  key={duration}
                  variant={timerDuration === duration ? 'default' : 'outline'}
                  onClick={() => setTimerDuration(duration)}
                  size="sm"
                >
                  {duration}s
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
