import { useState, useEffect } from 'react';
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

const PEERJS_SERVER_URL = 'https://pictionary-peerjs-server.onrender.com';

const Menu = ({
  inputCode,
  onInputCodeChange,
  onCreateRoom,
  onJoinRoom,
  isJoining,
}: MenuProps) => {
  const { wordProviderSettings, updateWordProvider, timerDuration, setTimerDuration } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'waking' | 'error'>('checking');

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const startTime = Date.now();
        const response = await fetch(PEERJS_SERVER_URL, {
          method: 'GET',
          cache: 'no-cache',
        });
        const duration = Date.now() - startTime;

        if (response.ok) {
          if (duration > 5000) {
            setServerStatus('waking');
            setTimeout(() => setServerStatus('online'), 2000);
          } else {
            setServerStatus('online');
          }
        } else {
          setServerStatus('error');
        }
      } catch (error) {
        setServerStatus('waking');
        setTimeout(() => {
          checkServerStatus();
        }, 3000);
      }
    };

    checkServerStatus();
  }, []);

  const getStatusBadge = () => {
    switch (serverStatus) {
      case 'checking':
        return (
          <div className="text-sm text-gray-300 mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            Checking server status...
          </div>
        );
      case 'waking':
        return (
          <div className="text-sm text-yellow-300 mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            Waking up server... (30s)
          </div>
        );
      case 'online':
        return (
          <div className="text-sm text-green-300 mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full" />
            Server ready
          </div>
        );
      case 'error':
        return (
          <div className="text-sm text-red-300 mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-red-400 rounded-full" />
            Server error - please try again
          </div>
        );
    }
  };

  return (
    <div className="app">
      <h1>🎨 Pictionary</h1>
      {getStatusBadge()}
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
