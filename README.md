# Guess Who? - Multiplayer Web Game

A real-time multiplayer implementation of the classic "Guess Who?" game built with React, TypeScript, and PeerJS for peer-to-peer communication.

## 🎮 What is this?

This is a digital version of the beloved board game "Guess Who?" where two players try to guess each other's secret character by asking yes/no questions. Players can eliminate characters by clicking to cross them out, and all actions are synchronized in real-time between players.

## ✨ Features

- **Real-time Multiplayer**: Play with friends using peer-to-peer connections (no server required!)
- **24 Random Superhero Characters**: Each game features a different set of characters from a superhero API
- **Cross-out Mechanism**: Click characters to eliminate them from your board
- **Synchronized Game State**: Both players see each other's crossed-out characters in real-time
- **Room-based System**: Create or join rooms using simple room codes
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 How to Play

### Starting a Game

1. **Create a Room**: Click "Create Room" and share the generated room code with your friend
2. **Join a Room**: Enter your friend's room code and click "Join Room"
3. **Wait for Connection**: The game will start automatically once both players are connected

### Playing

1. Each player gets a **secret character** (shown at the top)
2. Your goal is to guess your opponent's secret character
3. Ask yes/no questions about physical characteristics (e.g., "Does your character have blonde hair?")
4. **Click characters** to cross them out based on your opponent's answers
5. Crossed-out characters are synchronized between both players
6. First player to correctly guess the opponent's character wins!

## 🛠 Technical Details

### Built With

- **React 18** with TypeScript for the UI
- **PeerJS** for real-time peer-to-peer communication
- **Vite** for fast development and building
- **CSS3** for styling and animations

### Architecture

The codebase follows clean architecture principles:

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── CharacterCard.tsx
│   │   └── SecretCharacter.tsx
│   └── features/        # Business logic components
│       ├── Menu.tsx
│       ├── Waiting.tsx
│       └── Game.tsx
├── hooks/               # Custom React hooks
│   ├── useCharacters.ts # API data fetching
│   ├── usePeerConnection.ts # PeerJS networking
│   └── useGameState.ts  # Game state management
├── types.ts             # TypeScript definitions
└── App.tsx              # Main application component
```

### Key Features

- **Peer-to-Peer Networking**: No backend server needed - players connect directly
- **Real-time Synchronization**: All game actions are instantly shared between players
- **Clean Code Structure**: Modular components and custom hooks for maintainability
- **Type Safety**: Full TypeScript implementation for better developer experience

## 🏃‍♂️ Running the Project

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YoseptF/Guess_Who.git
cd Guess_Who

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Building for Production

```bash
# Create production build
npm run build

# Preview the production build
npm run preview
```

## 🎯 Game Rules

1. **Setup**: Each player has the same set of 24 characters but different secret characters
2. **Objective**: Be the first to correctly identify your opponent's secret character
3. **Gameplay**:
   - Take turns asking yes/no questions
   - Cross out characters based on answers
   - Make educated guesses as you narrow down possibilities
4. **Winning**: Correctly guess your opponent's secret character

## 🔧 Development

The project uses:

- **ESLint** for code linting
- **TypeScript** for type checking
- **Vite** for fast development builds
- **Modern React patterns** with functional components and hooks

### Code Style

- Clean, modular component structure
- Custom hooks for business logic
- TypeScript for type safety
- Separation of UI and business logic components

## 🤝 Contributing

Feel free to submit issues and pull requests to improve the game!

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Have fun playing Guess Who? with your friends! 🎉**
