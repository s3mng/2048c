import { useEffect, useState  } from 'react';
import { getEmpty, moveMapIn2048Rule, spawnRandomTile } from './logic';
import type { Map2048 } from './logic';
import './App.css';
import { json } from 'stream/consumers';



const SIZE = 4;
const createBoard = ():Map2048 => 
  Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => null));

const STORAGE_KEY = "b2048";




const App = () => {
  const [isWin, setIsWin] = useState(false);
  const [board, setBoard] = useState<Map2048>( () => {
    let b = createBoard();
    const saved= localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }

    
    b = spawnRandomTile(b);
    b = spawnRandomTile(b);
    return b;
  })
  const [previousBoard, setPreviousBoard] = useState<Map2048 | null>(null);


useEffect( () => {
  localStorage.setItem(STORAGE_KEY,JSON.stringify(board));
  if (board.flat().includes(128)) {
      setIsWin(true);
    }
},[board])

  useEffect ( () => {
    const handleKeyDown = (e: KeyboardEvent) => {
      
      let direction: 'up' | 'down' | 'left' | 'right' | null = null;
      switch(e.key) {
        case 'ArrowUp':
          direction = 'up';
          break;
        case 'ArrowDown':
          direction = 'down';
          break;
        case 'ArrowLeft':
          direction = 'left';
          break;
        case 'ArrowRight':
          direction = 'right';
          break;
      }

      if (direction) {
        e.preventDefault();
        const {result, isMoved} = moveMapIn2048Rule(board,direction);
        if (isMoved){
          setPreviousBoard(board); 
          const newBoard = spawnRandomTile(result);
          setBoard(newBoard);
        }
      }






    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);



  }, [board]);

  const undo = () => {
    if (previousBoard) {
      setBoard(previousBoard);
      setPreviousBoard(null);
      setIsWin(false);
    }
  }

  const reset = () => {
    let b = createBoard();
    b = spawnRandomTile(b);
    b = spawnRandomTile(b);
    setBoard(b);
    setPreviousBoard(null);
    setIsWin(false);
    localStorage.removeItem(STORAGE_KEY);
  };



  return (
    <div className="app-container">
      <div className="controls">
        <button onClick={undo} disabled={!previousBoard}>
          Undo
        </button>
        <button onClick={reset}>Reset</button>
      </div>

{isWin && <div className="message">🎉 이겼습니다~ 128뿐이지만... 🎉</div>}


      <div
        className="board"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 80px)` }}
      >
        {board.flatMap((row, r) =>
          row.map((cell, c) => (
            <div key={`${r}-${c}`} className={`cell ${cell ? `cell-${cell}` : ""}`}>
              {cell}
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export default App;
