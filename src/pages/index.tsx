import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [maze, setmaze] = useState([
    [0, 0, 0], //0が通れる場所
    [0, 0, 0], //1が柱または柱が倒れた場所
    [0, 0, 0],
  ]);

  const directions = [
    [-1, 0], //左
    [1, 0], //右
    [0, -1], //上
    [0, 1], //下
  ];

  const [human, sethuman] = useState();

  const maketoweratodd = (x: number, y: number) => {
    //x, yともに奇数の場所に柱を生成(maze上)
    for (let x = 0; x < maze.length; x++) {
      for (let y = 0; y < maze[x].length; y++) {
        if (x % 2 !== 0 && y % 2 !== 0) {
          const updatemaze = [...maze];
          updatemaze[x][y] = 1;
          setmaze(updatemaze);
          console.table(maze);
        }
      }
    }
  };

  const falldowntower = (x: number, y: number) => {
    maketoweratodd(x, y);
    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
    }
  };

  const firstclick = (x: number, y: number) => {
    //迷路を生成
  };

  return (
    <div className={styles.container}>
      {['生成'].map((v) => (
        <li onClick={maketoweratodd} key={v}>
          (生成)
        </li>
      ))}
      <div className={styles.maze}>
        {maze.map((row, x) =>
          row.map((cell, y) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => onClick(x, y)} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
