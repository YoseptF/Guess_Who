export function App() {
  const games = [
    {
      name: 'Guess Who',
      description: 'Classic guessing game with different character packs',
      url: 'https://guesswho.yosept.me',
      status: 'Live',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🎮 Games by Yoseph
          </h1>
          <p className="text-xl text-gray-600">
            Collection of fun web games to play with friends
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {game.name}
              </h2>
              <p className="text-gray-600 mb-4">{game.description}</p>
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    game.status === 'Live'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {game.status}
                </span>
                <a
                  href={game.url}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Play Now
                </a>
              </div>
            </div>
          ))}
        </div>

        <footer className="text-center mt-16 text-gray-500">
          <p>More games coming soon...</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
