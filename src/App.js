// src/App.js
import React, { useState } from 'react';
import Maze from './components/Maze';
import './App.css';

const App = () => {
  const [grid, setGrid] = useState([]);
  const [entrance, setEntrance] = useState([0, 1]);
  const [exit, setExit] = useState([49, 48]);
  const [running, setRunning] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);

  return (
    <div className="App">
      <Maze 
        grid={grid} 
        setGrid={setGrid} 
        entrance={entrance} 
        setEntrance={setEntrance} 
        exit={exit} 
        setExit={setExit} 
        running={running} 
        setRunning={setRunning} 
        timerRunning={timerRunning} 
        setTimerRunning={setTimerRunning} 
      />
    </div>
  );
};

export default App;
