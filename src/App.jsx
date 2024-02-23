import { useEffect, useState } from 'react';
import { StartScreen, PlayScreen } from './Screens';
import Sun from './assets/sun.svg';
import Moon from './assets/moon.svg';
import { LeaderboardScreen } from './Leaderboard';

function App() {
  const [gameState, setGameState] = useState('start');
  const [theme, setTheme] = useState('light');
  const [mode, setMode] = useState(null);
  const [gridSize, setGridSize] = useState(16);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState({});
  const [challengeLeaderboard, setChallengeLeaderboard] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setGameState('play');
  };

  const handleLeaderboardClick = () => {
    setShowLeaderboard(true); // Update state to show leaderboard
  };


  return (
    <>
      <div className='absolute flex justify-between w-full px-6 items-center gap-2 text-lg lg:text-xl bg-white dark:bg-zinc-900 py-3 border-b border-gray-300 shadow'>
        <button
          onClick={() => {
            if (!showLeaderboard) {
              handleLeaderboardClick();
            } else {
              setGameState('start');
              setShowLeaderboard(false);
            }
          }}
          className='p-3 bg-white hover:bg-indigo-200 hover:ring-2 hover:ring-indigo-400 rounded-lg shadow border border-grey-300 transition-all duration-300 ease-in-out'>
          {showLeaderboard ? 'Home' : 'Leaderboard'}
        </button>
        <div className='flex gap-2 sm:gap-4 p-2 rounded-full bg-white border border-grey-700 dark:border-transparent shadow w-20 sm:w-28 justify-between ring-2 ring-indigo-400'>
          <img
            src={Sun}
            className={`size-7 sm:size-10 p-2 ${
              theme === 'light' && 'bg-indigo-200 ring-2 ring-indigo-400'
            } transition-all duration-300 ease-in-out cursor-pointer hover:bg-indigo-100 rounded-full`}
            onClick={() => handleThemeChange('light')}
            alt='Light Mode'
          />
          <img
            src={Moon}
            className={`size-7 sm:size-10 p-2 ${
              theme === 'dark' && 'bg-indigo-200 ring-2 ring-indigo-400'
            } transition-all duration-300 ease-in-out cursor-pointer hover:bg-indigo-100 rounded-full`}
            onClick={() => handleThemeChange('dark')}
            alt='Dark Mode'
          />
        </div>
      </div>

      {/* Render LeaderboardScreen if showLeaderboard state is true */}
      {showLeaderboard && <LeaderboardScreen leaderboardData={leaderboardData} setLeaderboardData={setLeaderboardData} challengeLeaderboard={challengeLeaderboard} setChallengeLeaderboard={setChallengeLeaderboard} />}

      {/* Render StartScreen or PlayScreen based on gameState */}
      {!showLeaderboard && gameState === 'start' && (
        <StartScreen
          start={(selectedMode) => handleModeSelect(selectedMode)}
          gridSize={gridSize}
          setGridSize={setGridSize}
        />
      )}

      {!showLeaderboard && gameState === 'play' && (
        <PlayScreen
          gridSize={gridSize}
          mode={mode}
          end={() => setGameState('start')}
          leaderboardData={leaderboardData} setLeaderboardData={setLeaderboardData} challengeLeaderboard={challengeLeaderboard} setChallengeLeaderboard={setChallengeLeaderboard}
        />
      )}
    </>
  );
}

export default App;
