import React, { useEffect, useState, useCallback } from 'react';
import './Car.css';

const Car = ({ grid, entrance, exit, running, setRunning, setTimerRunning }) => {
  const [position, setPosition] = useState(entrance);
  const [path, setPath] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); 
  const [carState, setCarState] = useState('stop');

  const directions = [
    { dx: 0, dy: 1 },  // down
    { dx: 1, dy: 0 },  // right
    { dx: 0, dy: -1 }, // up
    { dx: -1, dy: 0 }, // left
  ];

  const getNextPosition = (currentPosition, direction) => {
    const { dx, dy } = directions[direction];
    return [currentPosition[0] + dx, currentPosition[1] + dy];
  };

  const isPath = (position) => {
    const [x, y] = position;
    return x >= 0 && y >= 0 && x < grid.length && y < grid[0].length && !grid[x][y].isWall;
  };

  const turnCar = (newDirection) => {
    const diff = (newDirection - direction + 4) % 4;
    if (diff === 1) {
      setCarState('turn-right');
    } else if (diff === 3) {
      setCarState('turn-left');
    } else if (diff === 2) {
      setCarState('turn-180');
    }
    setDirection(newDirection);
  };

  const navigateMaze = useCallback(() => {
    if (path.length > 0) {
      const nextPosition = path[index + 1];
      if (nextPosition) {
        const [nextX, nextY] = nextPosition;

        let newDirection = direction;
        if (nextX > position[0]) newDirection = 1; // right
        else if (nextX < position[0]) newDirection = 3; // left
        else if (nextY > position[1]) newDirection = 0; // down
        else if (nextY < position[1]) newDirection = 2; // up

        turnCar(newDirection);

        setTimeout(() => {
          setPosition([nextX, nextY]);
          setCarState('move');
          setTimeout(() => setCarState('stop'), 50); 
          setIndex(index + 1);
        }, 50); 

        if (nextX === exit[0] && nextY === exit[1]) {
          setRunning(false);
          setTimerRunning(false);
        }
      }
    }
  }, [path, index, position, direction, exit, setRunning, setTimerRunning]);

  useEffect(() => {
    const dfs = (x, y, visited = new Set()) => {
      if (x === exit[0] && y === exit[1]) return [[x, y]];
      visited.add(`${x},${y}`);

      for (let i = 0; i < 4; i++) {
        const [nx, ny] = getNextPosition([x, y], i);
        if (isPath([nx, ny]) && !visited.has(`${nx},${ny}`)) {
          const path = dfs(nx, ny, visited);
          if (path) return [[x, y], ...path];
        }
      }
      return null;
    };

    if (running) {
      const resultPath = dfs(entrance[0], entrance[1]);
      setPath(resultPath || []);
      setIndex(0);
      setPosition(entrance);
      setDirection(0);
      setCarState('stop');
    }
  }, [running, entrance, exit, grid]);

  useEffect(() => {
    if (running && path.length > 0 && index < path.length - 1) {
      navigateMaze();
    }
  }, [running, path, index, navigateMaze]);

  return (
    <div
      className={`car ${carState}`}
      style={{
        top: position[0] * 20,
        left: position[1] * 20,
        transition: `top 0.05s, left 0.05s`,
        color: 'blue', 
      }}
    >
      🚗
    </div>
  );
};

export default Car;
