import { useCallback, useEffect, useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const initialMaze = Array.from({ length: 51 }, () => Array(51).fill(0));
  const [maze, setMaze] = useState<number[][]>(initialMaze);

  const front = [
    [0, 1], //right
    [1, 0], //down
    [0, -1], //left
    [-1, 0], //up
  ];

  const [human, sethuman] = useState({
    x: 0,
    y: 0,
    //初期値下向き
    front: [1, 0],
  });

  const searchhuman = (x: number, y: number) => {
    if (x === human.x && y === human.y) {
      return true;
    }
    return false;
  };

  const movehuman = useCallback(() => {
    const right = rightdirection();
    // 右側の値を確認
    if (right[0] !== 0) {
      //進行方向が上下どちらかの場合
      changedirectionupdown(right[0]);
    } else {
      changedirectionleftright(right[1]);
    }
    checkgoal();
  }, [human]);

  const checkupdown = (num: number) => {
    //上下の確認
    if (human.x + num < 0 || human.x + num > 50 || maze[human.x + num][human.y] === 1) {
      return true;
    }
    return false;
  };

  const changedirectionupdown = (num: number) => {
    if (checkupdown(num)) {
      // 壁だよ
      checkfront();
    } else {
      // 向きの変更
      sethuman({ x: human.x + num, y: human.y, front: rightdirection() });
    }
  };

  const checkleftright = (num: number) => {
    if (human.y + num < 0 || human.y + num > 50 || maze[human.x][human.y + num] === 1) {
      return true;
    }
    return false;
  };

  const changedirectionleftright = (num: number) => {
    if (checkleftright(num)) {
      // 壁だよ
      checkfront();
    } else {
      // 向きの変更
      sethuman({ x: human.x, y: human.y + num, front: rightdirection() });
    }
  };

  const rightdirection = () => {
    if (JSON.stringify(human.front) === JSON.stringify([0, 1])) {
      // 右が正面の場合、下
      return [1, 0];
    } else if (JSON.stringify(human.front) === JSON.stringify([1, 0])) {
      // 下が正面の場合、左
      return [0, -1];
    } else if (JSON.stringify(human.front) === JSON.stringify([0, -1])) {
      // 左が正面の場合、上
      return [-1, 0];
    } else {
      // 上が正面の場合、右
      return [0, 1];
    }
  };

  const changedirection = () => {
    if (JSON.stringify(human.front) === JSON.stringify([0, 1])) {
      // 右が正面の場合、上
      sethuman({ x: human.x, y: human.y, front: [-1, 0] });
    } else if (JSON.stringify(human.front) === JSON.stringify([1, 0])) {
      // 下が正面の場合、右
      sethuman({ x: human.x, y: human.y, front: [0, 1] });
    } else if (JSON.stringify(human.front) === JSON.stringify([0, -1])) {
      // 左が正面の場合、下
      sethuman({ x: human.x, y: human.y, front: [1, 0] });
    } else {
      // 上が正面の場合、左
      sethuman({ x: human.x, y: human.y, front: [0, -1] });
    }
  };

  const checkfront = () => {
    // 正面の確認
    if (human.front[0] !== 0) {
      if (checkupdown(human.front[0]) === false) {
        sethuman({ x: human.x + human.front[0], y: human.y, front: human.front });
      } else {
        changedirection();
      }
    } else {
      if (checkleftright(human.front[1]) === false) {
        sethuman({ x: human.x, y: human.y + human.front[1], front: human.front });
      } else {
        changedirection();
      }
    }
  };

  const checkgoal = () => {
    if (human.x === 50 && human.y === 50) {
      alert('Goal!');
    }
  };

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

  const [searching, setSearching] = useState(false); // 探索中かどうかの状態を追加

  // useEffectを使用して探索を実行し、結果を反映
  useEffect(() => {
    if (searching) {
      const interval = setInterval(() => {
        movehuman();
        if (human.x === maze.length - 1 && human.y === maze[0].length - 1) {
          setSearching(false);
        }
      }, 35);
      return () => {
        clearInterval(interval);
      };
    }
  }, [searching, human.x, human.y, maze, movehuman]);

  return (
    <div className={styles.container}>
      <button onClick={() => puttoweraroundodd()}>生成</button>
      <button onClick={() => movehuman()}>探索</button>
      <button onClick={() => setSearching(true)}>自動探索</button>
      <div className={styles.maze}>
        {maze.map((row, x) =>
          row.map((cell, y) => (
            <div className={styles.cell} key={`${x}-${y}`}>
              {cell === 1 && <div className={styles.pillar} />}
              {searchhuman(x, y) === true &&
                JSON.stringify(human.front) === JSON.stringify([0, 1]) &&
                '▶︎'}
              {searchhuman(x, y) === true &&
                JSON.stringify(human.front) === JSON.stringify([1, 0]) &&
                '▼'}
              {searchhuman(x, y) === true &&
                JSON.stringify(human.front) === JSON.stringify([0, -1]) &&
                '◀︎'}
              {searchhuman(x, y) === true &&
                JSON.stringify(human.front) === JSON.stringify([-1, 0]) &&
                '▲'}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
