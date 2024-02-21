import { useEffect, useState } from "react";
import { StartScreen, PlayScreen } from "./Screens";
import Sun from "./assets/sun.svg";
import Moon from "./assets/moon.svg";

function App() {
  const [gameState, setGameState] = useState("start");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [theme]);

  switch (gameState) {
    case "start":
      return (
        <>
          <div className="absolute top-6 right-6 flex flex-col items-center gap-2 dark:text-white text-lg lg:text-2xl">
            <div className="flex gap-4 p-2 rounded-full bg-white border border-grey-700 dark:border-transparent shadow w-28 justify-between">
              <img
                src={Sun}
                className={`size-10 p-2 ${
                  theme === "light" && "bg-indigo-200 ring-2 ring-indigo-400"
                } transition-all duration-300 ease-in-out cursor-pointer hover:bg-indigo-100 rounded-full`}
                onClick={() => setTheme("light")}
              ></img>
              <img
                src={Moon}
                className={`size-10 p-2 ${
                  theme === "dark" && "bg-indigo-200 ring-2 ring-indigo-400"
                } transition-all duration-300 ease-in-out cursor-pointer hover:bg-indigo-100 rounded-full`}
                onClick={() => setTheme("dark")}
              />
            </div>
          </div>

          <StartScreen start={() => setGameState("play")} />
        </>
      );
    case "play":
      return (
        <>
          <div className="absolute top-6 right-6 flex flex-col items-center gap-2 dark:text-white text-lg lg:text-2xl">
            <div className="flex gap-4 p-2 rounded-full bg-white border border-grey-700 dark:border-transparent shadow w-28 justify-between">
              <img
                src={Sun}
                className={`size-10 p-2 ${
                  theme === "light" && "bg-indigo-200 ring-2 ring-indigo-400"
                } transition-all duration-300 ease-in-out cursor-pointer hover:bg-indigo-100 rounded-full`}
                onClick={() => setTheme("light")}
              ></img>
              <img
                src={Moon}
                className={`size-10 p-2 ${
                  theme === "dark" && "bg-indigo-200 ring-2 ring-indigo-400"
                } transition-all duration-300 ease-in-out cursor-pointer hover:bg-indigo-100 rounded-full`}
                onClick={() => setTheme("dark")}
              />
            </div>
          </div>
          <PlayScreen end={() => setGameState("start")} />
        </>
      );
    default:
      throw new Error("Invalid game state " + gameState);
  }
}

export default App;
