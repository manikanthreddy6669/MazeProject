import React, { useState, useEffect, useCallback } from 'react';
import Car from './Car';
import './Maze.css';

const Maze = () => {
  const size = 50;
  const [grid, setGrid] = useState([]);
  const [entrance, setEntrance] = useState([0, 1]);
  const [exit, setExit] = useState([size - 2, size - 1]);
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const generateMaze = useCallback((grid, x, y) => {
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    shuffle(directions);

    grid[x][y].isWall = false;
    for (const [dx, dy] of directions) {
      const nx = x + dx * 2;
      const ny = y + dy * 2;
      if (nx >= 0 && ny >= 0 && nx < size && ny < size && grid[nx][ny].isWall) {
        grid[x + dx][y + dy].isWall = false;
        generateMaze(grid, nx, ny);
      }
    }
  }, [size]);

  const ensureExitPath = (grid, exit) => {
    const [exitRow, exitCol] = exit;
    if (grid[exitRow - 1] && grid[exitRow - 1][exitCol] && grid[exitRow - 1][exitCol].isWall &&
        grid[exitRow + 1] && grid[exitRow + 1][exitCol] && grid[exitRow + 1][exitCol].isWall &&
        grid[exitRow][exitCol - 1] && grid[exitRow][exitCol - 1].isWall &&
        grid[exitRow][exitCol + 1] && grid[exitRow][exitCol + 1].isWall) {
      grid[exitRow - 1][exitCol].isWall = false;
    }
  };

  const initializeGrid = useCallback(() => {
    const initialGrid = Array.from({ length: size }, (_, row) =>
      Array.from({ length: size }, (_, col) => ({
        isWall: true,
        isEntrance: false,
        isExit: false,
        isBorder: row === 0 || col === 0 || row === size - 1 || col === size - 1
      }))
    );

    generateMaze(initialGrid, 1, 1);

    initialGrid[entrance[0]][entrance[1]] = { isWall: false, isEntrance: true, isExit: false };

    // Ensure exit point is not a wall and attached to a path
    const exitRow = exit[0];
    const exitCol = exit[1];
    initialGrid[exitRow][exitCol] = { isWall: false, isEntrance: false, isExit: true };

    ensureExitPath(initialGrid, exit);

    setGrid(initialGrid);
  }, [size, entrance, exit, generateMaze]);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  useEffect(() => {
    let timer;
    if (timerRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!timerRunning && time !== 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [timerRunning, time]);

  const handleStartStop = () => {
    setRunning(!running);
    if (!running) {
      setTime(0);  // Reset time
      setTimerRunning(true);
    } else {
      setTimerRunning(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="maze-container">
      <h2 class="title"> Maze Project</h2>
      <div className="controls">
        <button className="start-button" onClick={handleStartStop}>{running ? 'Stop' : 'Start'}</button>
        <h3><span>Time: {formatTime(time)}</span></h3>
      </div>
      <div className="maze-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="maze-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`maze-cell ${cell.isWall ? 'wall' : ''} ${cell.isEntrance ? 'entrance' : ''} ${cell.isExit ? 'exit' : ''} ${cell.isBorder ? 'border' : ''}`}
              />
            ))}
          </div>
        ))}
        {grid.length > 0 && (
          <Car grid={grid} entrance={entrance} exit={exit} running={running} setRunning={setRunning} setTimerRunning={setTimerRunning} />
        )}
      </div>
    </div>
  );
};

export default Maze;
