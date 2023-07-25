import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [maze, setMaze] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const front = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const [human, setHuman] = useState({
    x: 0,
    y: 0,
    //初期値下向き
    front: [1, 0],
  });

  const maketoweratodd = () => {
    const startCells: number[][] = [];
    for (let x = 0; x < maze.length; x++) {
      for (let y = 0; y < maze[x].length; y++) {
        if (x % 2 === 1 && y % 2 === 1) {
          startCells.push([x, y]);
          const updatedMaze = [...maze];
          updatedMaze[x][y] = 1;
          setMaze(updatedMaze);
        }
      }
    }
    return startCells;
  };

  const puttoweraroundodd = () => {
    const startCells = maketoweratodd();
    const updatemaze = [...maze];
    for (const startCell of startCells) {
      const [x, y] = startCell;

      //ランダム方向選択
      const randomDirectionIndex = Math.floor(Math.random() * 4);
      const randomDirection = front[randomDirectionIndex];
      const [dx, dy] = randomDirection;

      //選択した方向のセルが迷路ないならそのセルの値を1に変更
      const newX = x + dx;
      const newY = y + dy;

      if (newX < maze.length && newY < maze[0].length) {
        updatemaze[newX][newY] = 1;
      }
    }
    setMaze(updatemaze);
  };

  return (
    <div className={styles.container}>
      {['生成'].map((v) => (
        <li onClick={puttoweraroundodd} key={v}>
          {v}
        </li>
      ))}

      <div className={styles.maze}>
        {maze.map((row, x) =>
          row.map((cell, y) => (
            <div className={styles.cell} key={`${x}-${y}`}>
              {cell === 1 && <div className={styles.pillar} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
