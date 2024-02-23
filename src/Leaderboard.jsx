import React, { useState, useEffect } from 'react';
import * as icons from 'react-icons/gi';

// Function to update leaderboard data for normal play
export const updateLeaderboard = (
  leaderboardData,
  setLeaderboardData,
  level,
  playerName,
  score
) => {
  const updatedData = {
    ...leaderboardData,
    [level]: { ...leaderboardData[level], [playerName]: score },
  };
  setLeaderboardData(updatedData);
  // Save updated leaderboard data to local storage
  localStorage.setItem(
    'normalPlayLeaderboardData',
    JSON.stringify(updatedData)
  );
};

export function NormalPlayLeaderboard({ leaderboardData, setLeaderboardData }) {
  useEffect(() => {
    // Retrieve leaderboard data for normal play from local storage on component mount
    const storedData = localStorage.getItem('normalPlayLeaderboardData');
    if (storedData) {
      setLeaderboardData(JSON.parse(storedData));
    }
  }, []);

  return (
    <div className='max-w-lg mx-auto'>
      <h2 className='text-2xl font-bold mb-4'>Normal Play Leaderboard</h2>
      <div className='mb-6'>
        <h3 className='text-xl font-semibold mb-2'>Easy Level</h3>
        <ul className='list-disc list-inside'>
          {leaderboardData.easy ? (
            Object.entries(leaderboardData.easy).map(([playerName, score]) => (
              <li key={playerName} className='text-lg'>
                {playerName}: {score} tries
              </li>
            ))
          ) : (
            <Empty />
          )}
        </ul>
      </div>
      <div className='mb-6'>
        <h3 className='text-xl font-semibold mb-2'>Medium Level</h3>
        <ul className='list-disc list-inside'>
          {leaderboardData.medium ? (
            Object.entries(leaderboardData.medium).map(
              ([playerName, score]) => (
                <li key={playerName} className='text-lg'>
                  {playerName}: {score} tries
                </li>
              )
            )
          ) : (
            <Empty />
          )}
        </ul>
      </div>
      <div>
        <h3 className='text-xl font-semibold mb-2'>Hard Level</h3>
        <ul className='list-disc list-inside'>
          {leaderboardData.hard ? (
            Object.entries(leaderboardData.hard).map(([playerName, score]) => (
              <li key={playerName} className='text-lg'>
                {playerName}: {score} tries
              </li>
            ))
          ) : (
            <Empty />
          )}
        </ul>
      </div>
    </div>
  );
}

// Function to update leaderboard data for challenge play
export const updateChallLeaderboard = (
  challengeLeaderboard,
  setChallengeLeaderboard,
  player1,
  player2,
  date,
  score1,
  score2
) => {
  const updatedData = [
    ...challengeLeaderboard,
    { player1, player2, date, score1, score2 },
  ];
  setChallengeLeaderboard(updatedData);
  // Save updated leaderboard data to local storage
  localStorage.setItem(
    'challengePlayLeaderboardData',
    JSON.stringify(updatedData)
  );
};

export function LeaderboardScreen({
  leaderboardData,
  setLeaderboardData,
  challengeLeaderboard,
  setChallengeLeaderboard,
}) {
  const [activeTab, setActiveTab] = useState('normal');

  return (
    <div className='p-4 grid min-h-screen place-content-center bg-white dark:bg-gradient-to-r dark:from-zinc-800 dark:to-zinc-900 pt-28 dark:text-white'>
      {/* Render tab buttons */}
      <div className='flex space-x-4 mb-4 justify-center  w-[85vw] mx-auto'>
        <button
          className={`px-4 py-2 rounded-md focus:outline-none shadow-inner ${
            activeTab === 'normal'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('normal')}>
          Normal Play
        </button>
        <button
          className={`px-4 py-2 rounded-md focus:outline-none shadow-inner ${
            activeTab === 'challenge'
              ? 'bg-indigo-500 text-white dark:bg-gradient-to-b dark:from-indigo-500 dark:to-indigo-600'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('challenge')}>
          Challenge Play
        </button>
      </div>

      {/* Render leaderboards based on active tab */}
      <div className=' w-[85vw] mx-auto text-center'>
        {activeTab === 'normal' && (
          <NormalPlayLeaderboard
            leaderboardData={leaderboardData}
            setLeaderboardData={setLeaderboardData}
          />
        )}
        {activeTab === 'challenge' && (
          <ChallengePlayLeaderboard
            challengeLeaderboard={challengeLeaderboard}
            setChallengeLeaderboard={setChallengeLeaderboard}
          />
        )}
      </div>
   
    </div>
  );
}

// Component for challenge play leaderboard
export function ChallengePlayLeaderboard({
  challengeLeaderboard,
  setChallengeLeaderboard,
}) {
  useEffect(() => {
    // Retrieve leaderboard data for challenge play from local storage on component mount
    const storedData = localStorage.getItem('challengePlayLeaderboardData');
    if (storedData) {
      setChallengeLeaderboard(JSON.parse(storedData));
    }
  }, []);
  return (
    <div>
      <h2 className='mb-5 text-2xl font-bold'>Challenge Play Leaderboard</h2>
      {challengeLeaderboard.length != 0 ? (
        <table className='table-auto border-collapse mx-auto'>
          <thead className='bg-indigo-500 text-white dark:bg-gradient-to-b dark:from-indigo-500 dark:to-indigo-600'>
            <tr>
              <th className='p-2 border border-gray-300'>Date</th>
              <th className='p-2 border border-gray-300'>Player 1</th>
              <th className='p-2 border border-gray-300'>Player 2</th>
              <th className='p-2 border border-gray-300'>Player 1 Score</th>
              <th className='p-2 border border-gray-300'>Player 2 Score</th>
            </tr>
          </thead>
          <tbody>
            {challengeLeaderboard.map((record, index) => (
              <tr key={index}>
                <td className='p-2 border border-gray-300'>{record.date}</td>
                <td className='p-2 border border-gray-300'>{record.player1 || 'Player 1'}</td>
                <td className='p-2 border border-gray-300'>{record.player2 || 'Player 2'}</td>
                <td className='p-2 border border-gray-300'>{record.score1}</td>
                <td className='p-2 border border-gray-300'>{record.score2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Empty />
      )}
    </div>
  );
}

export const Empty = () =>{
  return (
    <div className='flex flex-col items-center justify-center gap-4'>
    <icons.GiBoxUnpacking className='size-10'/>
     <p className='text-center'>No challenge game played yet</p>
   </div>
  )
}
