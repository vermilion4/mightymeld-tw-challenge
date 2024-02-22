import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";

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

export function StartScreen({ start }) {
  const handleNormalPlay = () => {
    start("normal");
  };
  const handleChallengePlay = () => {
    start("challenge");
  };
  return (
    <>
      <div className="grid min-h-screen place-content-center w-screen bg-white dark:bg-zinc-900">
        <div className="flex flex-col items-center bg-pink-50 dark:bg-gradient-to-tr dark:from-pink-400 dark:to-pink-600 rounded-xl pt-20 pb-20 w-[85vw] max-w-2xl">
          <h1 className="text-pink-500 dark:text-white text-4xl mb-10 font-semibold">
            Memory
          </h1>

          <p className="text-pink-500 dark:text-white mb-16 text-lg sm:text-xl lg:text-2xl font-medium">
            Flip over tiles looking for pairs
          </p>
          <button
            onClick={handleNormalPlay}
            className="text-white pt-2 pb-3 w-44 bg-gradient-to-t from-pink-600 to-pink-400 rounded-full text-3xl shadow-xl ring-2 ring-pink-400 transition-all duration-300 ease-out hover:scale-105"
          >
            Play
          </button>
          <button
            onClick={handleChallengePlay}
            className="text-white pt-2 pb-3 w-44 bg-gradient-to-t from-pink-600 to-pink-400 rounded-full text-3xl shadow-xl ring-2 ring-pink-400 transition-all duration-300 ease-out hover:scale-105 mt-6"
          >
            Challenge
          </button>
        </div>
      </div>
    </>
  );
}

export function PlayScreen({ mode, end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  const resetGame = () => {
    setTiles(null);
    setTryCount(0);
    setIsTimerRunning(false);
    setTimeElapsed(0);
    setCurrentPlayer(1);
    setScores({ player1: 0, player2: 0 });
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (timeInSec) => {
    const minutes = Math.floor(timeInSec / 60);
    const seconds = timeInSec % 60;

    return `${minutes} : ${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
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
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    if (flippedCount === 0) {
      startTimer();
    }

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) {
      return;
    }

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);
      setTimeout(() => {
        setCurrentPlayer((prevPlayer) => (prevPlayer === 1 ? 2 : 1));
      }, 1000);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";

        setScores((prevScores) => ({
          ...prevScores,
          [`player${currentPlayer}`]: prevScores[`player${currentPlayer}`] + 1,
        }));
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            stopTimer();
            // setTimeout(end, 0);
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
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <>
      <div className="grid w-screen min-h-screen place-content-center bg-white dark:bg-gradient-to-r dark:from-zinc-800 dark:to-zinc-900">
        <div className="lg:flex items-center gap-10">
          <div>
            <div className="text-center mb-4">
              <p
                className={`${
                  mode === "challenge" ? "block" : "hidden"
                } text-xl font-semibold text-indigo-500 dark:text-white mt-4`}
              >
                Current Player: Player{currentPlayer}
              </p>
            </div>
            <div className="flex gap-3 justify-between mb-12 items-center">
              <div className="flex gap-3 items-center">
                <div className="text-indigo-400 dark:text-white text-2xl lg:text-3xl font-medium">
                  Tries
                </div>
                <div className="px-3 lg:pb-1 bg-indigo-200 dark:bg-gradient-to-b dark:from-indigo-800 dark:to-indigo-900 text-indigo-500 dark:text-white text-xl lg:text-3xl rounded-lg font-semibold flex items-center">
                  {tryCount}
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <div className="text-indigo-400 dark:text-white text-2xl lg:text-3xl font-medium">
                  Time
                </div>
                <div className="px-3 lg:pb-1 bg-indigo-200 dark:bg-gradient-to-b dark:from-indigo-800 dark:to-indigo-900 text-indigo-500 dark:text-white text-xl lg:text-3xl rounded-lg font-semibold flex items-center">
                  {formatTime(timeElapsed)}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 mx-auto gap-5 p-5 bg-indigo-50 rounded-lg dark:bg-gradient-to-b dark:from-indigo-800 dark:to-indigo-900">
              {getTiles(16).map((tile, i) => (
                <Tile key={i} flip={() => flip(i)} {...tile} />
              ))}
            </div>
            <div className="flex justify-center mt-6 gap-4">
              <button
                className="bg-indigo-300 hover:bg-indigo-400 hover:scale-105 dark:bg-gradient-to-b dark:from-indigo-800 dark:to-indigo-900 transition-all ease-in-out duration-300 text-xl lg:text-2xl rounded-md text-white py-2 px-4"
                onClick={resetGame}
              >
                Reset Game
              </button>
              <button
                className="bg-indigo-300 hover:bg-indigo-400 hover:scale-105 dark:bg-gradient-to-b dark:from-indigo-800 dark:to-indigo-900 transition-all ease-in-out duration-300 text-xl lg:text-2xl rounded-md text-white py-2 px-4"
                onClick={() => setTimeout(end, 0)}
              >
                Home
              </button>
            </div>
          </div>
          <div
            className={`${
              mode === "challenge" ? "block" : "hidden"
            } text-center mt-4`}
          >
            <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-indigo-500 dark:text-white">
              Score Board
            </p>
            <div className="flex lg:flex-col gap-5 justify-between mt-6 items-center">
              <div className="flex gap-3 items-center">
                <div className="text-indigo-400 dark:text-white text-2xl lg:text-3xl font-medium">
                  Player 1
                </div>
                <div className="px-3 lg:pb-1 bg-indigo-200 dark:bg-gradient-to-b dark:from-indigo-800 dark:to-indigo-900 text-indigo-500 dark:text-white text-xl lg:text-3xl rounded-lg font-semibold flex items-center">
                  {scores.player1}
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <div className="text-indigo-400 dark:text-white text-2xl lg:text-3xl font-medium">
                  Player 2
                </div>
                <div className="px-3 lg:pb-1 bg-indigo-200 dark:bg-gradient-to-b dark:from-indigo-800 dark:to-indigo-900 text-indigo-500 dark:text-white text-xl lg:text-3xl rounded-lg font-semibold flex items-center">
                  {scores.player2}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
