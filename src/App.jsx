import { useEffect, useState } from "react";
import { StartScreen, PlayScreen } from "./Screens";
import Sun from "./assets/sun.svg";
import Moon from "./assets/moon.svg";

function App() {
  const [gameState, setGameState] = useState("start");
  const [theme, setTheme] = useState("light");
  const [mode, setMode] = useState(null);
  const [gridSize, setGridSize] = useState(16);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setGameState("play");
  };

  return (
    <>
      <div className="absolute top-6 right-6 flex flex-col items-center gap-2 text-lg lg:text-2xl dark:text-white">
        <div className="flex gap-2 sm:gap-4 p-2 rounded-full bg-white border border-grey-700 dark:border-transparent shadow w-20 sm:w-28 justify-between ring-2 ring-indigo-400">
          <img
            src={Sun}
            className={`size-7 sm:size-10 p-2 ${
              theme === "light" && "bg-indigo-200 ring-2 ring-indigo-400"
            } transition-all duration-300 ease-in-out cursor-pointer hover:bg-indigo-100 rounded-full`}
            onClick={() => handleThemeChange("light")}
            alt="Light Mode"
          />
          <img
            src={Moon}
            className={`size-7 sm:size-10 p-2 ${
              theme === "dark" && "bg-indigo-200 ring-2 ring-indigo-400"
            } transition-all duration-300 ease-in-out cursor-pointer hover:bg-indigo-100 rounded-full`}
            onClick={() => handleThemeChange("dark")}
            alt="Dark Mode"
          />
        </div>
      </div>

      {gameState === "start" && (
        <StartScreen
          start={(selectedMode) => handleModeSelect(selectedMode)}
          gridSize={gridSize}
          setGridSize={setGridSize}
        />
      )}

      {gameState === "play" && (
        <PlayScreen
          gridSize={gridSize}
          mode={mode}
          end={() => setGameState("start")}
        />
      )}
    </>
  );
}

export default App;
