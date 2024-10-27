import { useState } from "react";
import React from "react";


function Square({ highlighted, value, onSquareClick }) {
  return (
    <button className={"square " + highlighted} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  // const [squares, setSquares] = useState(Array(9).fill(null));
  const win = calculateWinner(squares);
  const winner = win.winner;
  const winsquares = win.winsquares;
  let status;
  if (winner === "draw") {
    status = "Draw";
  } else if (winner) {
    status = "Winner : " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    const nextSquares = squares.slice();
    // history.push(nextSquares);
    if (nextSquares[i] || calculateWinner(nextSquares).winner) {
      // already exists
      return;
    }
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares); // re-renders here
  }

  const rows = [];
  for (let i = 0; i < 3; i++) {
    let row = [];
    let s = [];
    for (let j = 0; j < 3; j++) {
      let cls = "";
      if (winner) {
        // console.log("get it ");
        if (winsquares.includes(j + i * 3)) {
          cls = "highlighted";
        }
      }
      s.push(
        <Square
          highlighted={cls}
          key={j + i * 3}
          value={squares[j + i * 3]}
          onSquareClick={() => handleClick(j + i * 3)}
        />
      );
    }
    row.push(
      <div key={"row" + i} className="board-row">
        {s}
      </div>
    );
    rows.push(row);
  }
  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}



function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let final = {
    winner: null,
    winsquares: [],
  };
  let fullcount = 0;
  for (let i = 0; i < 9; i++) {
    if (squares[i] !== null) {
      fullcount++;
    }
  }
  if (fullcount === 9) {
    final.winner = "draw";
  }
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // if not null.
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      final.winner = squares[a];
      final.winsquares = [a, b, c];
      // console.log(final.winsquares);
    }
  }
  return final;
}


export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [historyOrder, setHistoryOrder] = useState(true); // true for ascending
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handleReset(){ // resets board state
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  function handlePlay(nextSquares) {
    setHistory([...history.slice(0, currentMove + 1), nextSquares]);
    setCurrentMove(currentMove + 1);
    // setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    // setXIsNext(nextMove % 2 === 0);
  }


  // generate a bunch of buttons
  let movesButtons = history.map((squares, move) => {
    let descript; // move is the index of squares

    if (move > 0) {
      descript = "Go to move #" + move;
    } else {
      descript = "Go to game start";
    }
    return !(move === currentMove) ? (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{descript}</button>
      </li>
    ) : (
      // this button helps call jumpto move
      <li key={move}>You are at move #{move}.</li>
    );
  });


  if (historyOrder === false) {
    movesButtons = movesButtons.reverse();
  }


  
  // console.log(historyOrder);
  // initially a state of an empty game

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={handleReset}>Reset</button>
        <button onClick={() => setHistoryOrder(!historyOrder)}>
          {historyOrder ? " ascending history" : " descending history"}
        </button>
        <ul>{movesButtons}</ul>
      </div>
    </div>
  );
}
