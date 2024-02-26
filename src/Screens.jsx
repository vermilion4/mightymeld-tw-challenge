import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import * as icons from 'react-icons/gi';
import { Tile } from './Tile';
import Modal from './Modal';
import { updateChallLeaderboard, updateLeaderboard } from './Leaderboard';
import Sound from './assets/play.mp3';

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

const PlayMode = {
  NORMAL: 'normal',
  CHALLENGE: 'challenge',
};

export function StartScreen({ start, setGridSize, gridSize }) {
  const handleGridSizeSelect = (size) => {
    setGridSize(size);
  };

  const renderGridSizeButton = (size) => (
    <button
      onClick={() => handleGridSizeSelect(size)}
      className={`text-white pt-2 pb-3 w-32 bg-gradient-to-t ${
        gridSize === size
          ? 'from-pink-900 to-pink-700 ring-pink-700'
          : 'from-pink-600 to-pink-400 ring-pink-400'
      } rounded-full text-xl md:text-2xl shadow-xl ring-2 transition-all duration-300 ease-out hover:scale-105`}>
      {`${size / 4} x ${size / 4}`}
    </button>
  );

  const renderPlayButton = (text, onClick) => (
    <div>
      <button
        onClick={onClick}
        className='text-white pt-2 pb-3 w-44 bg-gradient-to-t from-pink-600 to-pink-400 rounded-full text-lg md:text-2xl shadow-xl ring-2 ring-pink-400 transition-all duration-300 ease-out hover:scale-105 '>
        {text}
      </button>
      <p className='text-rose-600 px-2 mt-2 rounded-md text-center text-sm dark:text-white'>
        {text === 'Play' ? '*Single player mode' : '*Multi player mode'}
      </p>
    </div>
  );

  return (
    <div className='grid min-h-screen place-content-center w-screen bg-white dark:bg-zinc-900 p-3 pt-28'>
      <div className='flex flex-col items-center bg-pink-50 dark:bg-gradient-to-tr dark:from-pink-400 dark:to-pink-600 rounded-xl pt-20 pb-20 w-[90vw] max-w-2xl px-2'>
        <h1 className='text-pink-500 dark:text-white text-4xl mb-10 font-semibold tracking-tight'>
          Memory
        </h1>
        <p className='text-pink-500 dark:text-white mb-8 text-lg sm:text-xl lg:text-2xl font-medium text-center'>
          Flip over tiles looking for pairs
        </p>
        <p className='text-pink-500 dark:text-white mb-8 text-lg sm:text-xl lg:text-2xl font-medium'>
          Grid chosen: {gridSize / 4} x {gridSize / 4}
        </p>
        <div className='flex gap-6 mb-8 flex-wrap justify-center'>
          {renderGridSizeButton(16)}
          {renderGridSizeButton(20)}
        </div>
        <div className='flex mt-6 gap-5 flex-wrap items-center justify-center'>
          {renderPlayButton('Play', () => start(PlayMode.NORMAL))}
          {renderPlayButton('Challenge', () => start(PlayMode.CHALLENGE))}
        </div>
      </div>
    </div>
  );
}

export function PlayScreen({
  mode,
  end,
  gridSize,
  leaderboardData,
  setLeaderboardData,
  challengeLeaderboard,
  setChallengeLeaderboard,
}) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);
  const [remainingTime, setRemainingTime] = useState(300);
  const [level, setLevel] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const scoresRef = useRef({ player1: 0, player2: 0 });
  const [cardFlipped, setCardFlipped] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    message: '',
    title: '',
    status: '',
  });
  const [playerNames, setPlayerNames] = useState({ player1: '', player2: '' });
  const [startChallenge, setStartChallenge] = useState(false);
  const [backgroundMusicPlaying, setBackgroundMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  const [shake, setShake] = useState(false)

  const playBackgroundMusic = () => {
    audioRef.current.play();
    setBackgroundMusicPlaying(true);
  };

  const stopBackgroundMusic = () => {
    audioRef.current.pause();
    setBackgroundMusicPlaying(false);
  };

  const startTimer = (selectedLevel) => {
    if (mode === 'normal') {
      if (selectedLevel === 'easy') {
        setRemainingTime(300); // 5 minutes for easy level
      } else if (selectedLevel === 'medium') {
        setRemainingTime(180); // 3 minutes for medium level
      } else if (selectedLevel === 'hard') {
        setRemainingTime(60); // 1 minute for hard level
      }
    } else {
      setRemainingTime(300); // 5 minutes for challenge mode
    }
  };

  const stopGame = () => {
    setModalMessage({
      message:
        "Time's up! Game over. You could not complete the challenge in time",
      title: 'Game Over',
      status: 'failure',
    });
    setShowModal(true);
    resetGame();
  };

  const resetGame = () => {
    setTiles(null);
    setTryCount(0);
    setLevel('');
    setCurrentPlayer(1);
    scoresRef.current = { player1: 0, player2: 0 };
    setRemainingTime(300);
    setCardFlipped(false);
    setPlayerNames({ player1: '', player2: '' });
    setStartChallenge(false);
    stopBackgroundMusic();
  };

  useEffect(() => {
    if ((mode === 'challenge' && cardFlipped) || (mode === 'normal' && level)) {
      if (remainingTime > 0) {
        const interval = setInterval(() => {
          setRemainingTime((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(interval);
      } else {
        // If remaining time is 0, stop the game
        stopGame();
      }
    }
  }, [remainingTime, level, mode, cardFlipped]);

  const formatTime = (timeInSec) => {
    const minutes = Math.floor(timeInSec / 60);
    const seconds = timeInSec % 60;

    return `${minutes} : ${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleLevelSelect = (selectedLevel) => {
    setLevel(selectedLevel);
    startTimer(selectedLevel); // Start timer when level is selected
  };

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error('The number of tiles must be even.');
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: 'start' }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === 'flipped') return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === 'flipped');
    const flippedCount = flippedTiles.length;

    if (flippedCount === 0 && mode === 'challenge') {
      setCardFlipped(true);
    }

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) {
      return;
    }

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);
      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = 'start';

      if (alreadyFlippedTile.content !== justFlippedTile.content){
        setShake(true)
      }

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = 'matched';

        scoresRef.current = {
          ...scoresRef.current,
          [`player${currentPlayer}`]:
            scoresRef.current[`player${currentPlayer}`] + 1,
        };
      }

      setTimeout(() => {
        setCurrentPlayer((prevPlayer) => (prevPlayer === 1 ? 2 : 1));
        setShake(false)
      }, 1000);

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === 'flipped' ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === 'matched')) {
            if (mode === 'normal') {
              setModalMessage({
                message: `You completed the game in ${tryCount} tries. With ${formatTime(
                  remainingTime
                )} left on the clock.`,
                title: 'Congratulations',
                status: 'success',
              });
            } else {
              const { player1, player2 } = scoresRef.current;

              if (player1 === player2) {
                setModalMessage({
                  message: `It's a draw! Both players scored ${player1} points.`,
                  title: 'Game Completed',
                  status: 'draw',
                });
              } else {
                setModalMessage({
                  message: `${
                    playerNames.player1 || 'Player 1'
                  } scored ${player1} point${player1 > 1 ? 's' : ''}. ${
                    playerNames.player2 || 'Player 2'
                  } scored ${player2} point${player2 > 1 ? 's' : ''}. ${
                    player1 > player2
                      ? playerNames.player1 || 'Player 1'
                      : playerNames.player2 || 'Player 2'
                  } wins!`,
                  title: 'Game Completed',
                  status: 'success',
                });
              }
            }

            setShowModal(true);

            if (mode === 'normal') {
              // Update normal play leaderboard
              updateLeaderboard(
                leaderboardData,
                setLeaderboardData,
                level,
                'You',
                tryCount
              );
            } else {
              const currentDate = new Date();
              const formattedDate = `${
                currentDate.getMonth() + 1
              }/${currentDate.getDate()}/${currentDate.getFullYear()}`;
              updateChallLeaderboard(
                challengeLeaderboard,
                setChallengeLeaderboard,
                playerNames.player1,
                playerNames.player2,
                formattedDate,
                scoresRef.current.player1,
                scoresRef.current.player2
              );
            }

            setTimeout(() => {
              resetGame();
            }, 3000);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? 'flipped' : tile.state,
      }));
    });
  };

  const handlePlayerNameChange = (event, player) => {
    const { value } = event.target;
    setPlayerNames((prevNames) => ({ ...prevNames, [player]: value }));
  };

  return (
    <>
      <div className='grid w-screen min-h-screen place-content-center bg-white dark:bg-gradient-to-r dark:from-zinc-800 dark:to-zinc-900 px-3 pt-28 pb-7'>
        {mode === 'normal' && !level && (
          <>
            <h2 className='text-3xl text-center mb-6 font-bold text-pink-600 dark:text-white'>
              Select Level
            </h2>
            <div className='flex justify-center gap-4 flex-wrap my-6'>
              <button
                onClick={() => handleLevelSelect('easy')}
                className='text-white pt-2 pb-3 w-44 bg-gradient-to-t from-pink-600 to-pink-400 rounded-full text-xl md:text-2xl shadow-xl ring-2 ring-pink-400 transition-all duration-300 ease-out hover:scale-105'>
                Easy
              </button>
              <button
                onClick={() => handleLevelSelect('medium')}
                className='text-white pt-2 pb-3 w-44 bg-gradient-to-t from-pink-600 to-pink-400 rounded-full text-xl md:text-2xl shadow-xl ring-2 ring-pink-400 transition-all duration-300 ease-out hover:scale-105'>
                Medium
              </button>
              <button
                onClick={() => handleLevelSelect('hard')}
                className='text-white pt-2 pb-3 w-44 bg-gradient-to-t from-pink-600 to-pink-400 rounded-full text-xl md:text-2xl shadow-xl ring-2 ring-pink-400 transition-all duration-300 ease-out hover:scale-105'>
                Hard
              </button>
            </div>

            <button
              className='underline hover:text-pink-700 transition-all ease-in-out duration-300 text-xl lg:text-2xl rounded-md text-pink-500 py-5 px-4 mt-5 mx-10'
              onClick={() => setTimeout(end, 0)}>
              Back to Home
            </button>
          </>
        )}
        {mode === 'challenge' && !startChallenge && (
          <div className={`text-center mt-4 dark:text-white w-[80vw] max-w-md`}>
            <h2 className='text-xl pb-5 text-pink-500 dark:text-white'>
              Enter Names of Challengers
            </h2>
            <div className='flex items-center mt-4 gap-4'>
              <label className='whitespace-nowrap'>Player 1</label>
              <input
                type='text'
                placeholder='Player 1 Name'
                value={playerNames.player1}
                onChange={(e) => handlePlayerNameChange(e, 'player1')}
                className='block border border-gray-300 p-2 rounded-md focus:outline-none focus:border-pink-500 dark:bg-transparent dark:text-white w-full'
              />
            </div>
            <div className='flex items-center mt-4 gap-4'>
              <label className='whitespace-nowrap'>Player 2</label>
              <input
                type='text'
                placeholder='Player 2 Name'
                value={playerNames.player2}
                onChange={(e) => handlePlayerNameChange(e, 'player2')}
                className='block border border-gray-300 p-2 rounded-md focus:outline-none focus:border-pink-500 dark:bg-transparent dark:text-white w-full'
              />
            </div>
            <div className='flex flex-wrap mt-8 gap-4 items-center justify-center'>
              <button
                onClick={() => setStartChallenge(true)}
                className='text-white bg-gradient-to-t from-pink-600 to-pink-400 rounded-full text-lg md:text-xl shadow-xl ring-2 ring-pink-400 transition-all duration-300 ease-out hover:scale-105 p-3'>
                Start Game
              </button>
              <button
                className='bg-white shadow hover:scale-105 transition-all ease-in-out duration-300 text-xl md:text-xl rounded-full text-pink-500  border border-grey-400 p-3'
                onClick={() => setTimeout(end, 0)}>
                Back to Home
              </button>
            </div>
          </div>
        )}
        {(mode === 'normal' && level) ||
        (mode === 'challenge' && startChallenge) ? (
          <div className='lg:flex items-center gap-10'>
            <div>
              <div className='text-center mb-4'>
                {mode === 'challenge' && (
                  <p
                    className={`text-xl font-semibold text-indigo-500 dark:text-white mb-4 capitalize`}>
                    {playerNames.player1 || 'Player 1'} vs{' '}
                    {playerNames.player2 || 'Player 2'}
                  </p>
                )}
                <p
                  className={`text-xl font-semibold text-indigo-500 dark:text-white mt-4 capitalize`}>
                  {mode === 'normal'
                    ? `${level} Mode`
                    : `Current Player Turn: ${
                        currentPlayer === 1
                          ? playerNames.player1 || 'Player 1'
                          : playerNames.player2 || 'Player 2'
                      }`}
                </p>
              </div>
              <div className='flex gap-3 justify-between mb-12 items-center'>
                <div className='flex gap-3 items-center'>
                  <div className='text-indigo-400 dark:text-white text-2xl lg:text-3xl font-medium'>
                    Tries
                  </div>
                  <div className='px-3 bg-indigo-200 dark:bg-gradient-to-b dark:from-indigo-800 dark:to-indigo-900 text-indigo-500 dark:text-white text-xl lg:text-3xl rounded-lg font-semibold flex items-center'>
                    {tryCount}
                  </div>
                </div>

                <div className='flex gap-3 items-center'>
                  <div className='text-indigo-400 dark:text-white text-2xl lg:text-3xl font-medium'>
                    Time
                  </div>
                  <div className='px-3 bg-indigo-200 dark:bg-gradient-to-b dark:from-indigo-800 dark:to-indigo-900 text-indigo-500 dark:text-white text-xl lg:text-3xl rounded-lg font-semibold flex items-center'>
                    {formatTime(remainingTime)}
                  </div>
                </div>
              </div>
              <div
                className={`grid ${
                  gridSize === 16
                    ? 'grid-cols-4 gap-3 p-4'
                    : 'grid-cols-5 gap-2 p-3'
                } mx-auto bg-indigo-50 rounded-lg dark:bg-gradient-to-b dark:from-indigo-800 dark:to-indigo-900`}>
                {getTiles(gridSize).map((tile, i) => (
                  <Tile shake={shake} key={i} flip={() => flip(i)} {...tile} />
                ))}
              </div>
              <div className='flex flex-col items-center gap-5 mt-6 '>
                <div>
                  <audio ref={audioRef} src={Sound} loop={true} />
                  {/* toggle background music */}
                  {backgroundMusicPlaying ? (
                    <button
                      className='bg-indigo-300 hover:bg-indigo-400 hover:scale-105 dark:bg-gradient-to-b dark:from-indigo-800 dark:to-indigo-900 transition-all ease-in-out duration-300 text-xl lg:text-2xl rounded-md text-white py-2 px-4'
                      onClick={stopBackgroundMusic}>
                      Stop Music
                    </button>
                  ) : (
                    <button
                      className='bg-indigo-300 hover:bg-indigo-400 hover:scale-105 dark:bg-gradient-to-b dark:from-indigo-800 dark:to-indigo-900 transition-all ease-in-out duration-300 text-xl lg:text-2xl rounded-md text-white py-2 px-4'
                      onClick={playBackgroundMusic}>
                      Play Music
                    </button>
                  )}
                </div>
                <div className='flex justify-center flex-wrap gap-4'>
                  <button
                    className='bg-indigo-300 hover:bg-indigo-400 hover:scale-105 dark:bg-gradient-to-b dark:from-indigo-800 dark:to-indigo-900 transition-all ease-in-out duration-300 text-xl lg:text-2xl rounded-md text-white py-2 px-4'
                    onClick={resetGame}>
                    Reset Game
                  </button>
                  <button
                    className='bg-indigo-300 hover:bg-indigo-400 hover:scale-105 dark:bg-gradient-to-b dark:from-indigo-800 dark:to-indigo-900 transition-all ease-in-out duration-300 text-xl lg:text-2xl rounded-md text-white py-2 px-4'
                    onClick={() => setTimeout(end, 0)}>
                    Home
                  </button>
                </div>
              </div>
            </div>
            <div
              className={`${
                mode === 'challenge' ? 'block' : 'hidden'
              } text-center mt-4`}>
              <p className='text-lg sm:text-xl lg:text-2xl font-semibold text-indigo-500 dark:text-white'>
                Score Board
              </p>
              <div className='flex lg:flex-col gap-5 justify-between mt-6 items-center'>
                <div className='flex gap-3 items-center'>
                  <div className='text-indigo-400 dark:text-white text-2xl lg:text-3xl font-medium capitalize'>
                    {playerNames.player1 || 'Player 1'}
                  </div>
                  <div className='px-3 lg:pb-1 bg-indigo-200 dark:bg-gradient-to-b dark:from-indigo-800 dark:to-indigo-900 text-indigo-500 dark:text-white text-xl lg:text-3xl rounded-lg font-semibold flex items-center'>
                    {scoresRef.current.player1}
                  </div>
                </div>

                <div className='flex gap-3 items-center'>
                  <div className='text-indigo-400 dark:text-white text-2xl lg:text-3xl font-medium capitalize'>
                    {playerNames.player2 || 'Player 2'}
                  </div>
                  <div className='px-3 lg:pb-1 bg-indigo-200 dark:bg-gradient-to-b dark:from-indigo-800 dark:to-indigo-900 text-indigo-500 dark:text-white text-xl lg:text-3xl rounded-lg font-semibold flex items-center'>
                    {scoresRef.current.player2}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage.message}
        status={modalMessage.status}
        title={modalMessage.title}
      />
    </>
  );
}
