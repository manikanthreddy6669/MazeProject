import React from 'react';
import './Grid.css';

const Grid = ({ grid }) => {
  return (
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`cell ${cell.isWall ? 'wall' : 'path'} ${cell.isEntrance ? 'entrance' : ''} ${cell.isExit ? 'exit' : ''}`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
