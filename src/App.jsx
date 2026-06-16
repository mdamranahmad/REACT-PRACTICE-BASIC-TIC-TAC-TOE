import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, square, onPlay }) {
  const winner = calculateWinner(square);
  const status = winner
    ? "Winner: " + winner
    : "Next Player: " + (xIsNext ? "X" : "O");
  function handleClick(i) {
    if (square[i] || calculateWinner(square)) return;
    const nextSquare = square.slice();
    nextSquare[i] = xIsNext ? "X" : "O";
    onPlay(nextSquare);
  }

  const squareList = [];
  for (let r = 0; r < 3; r++) {
    const rows = [];
    for (let c = 0; c < 3; c++) {
      const squaresIndex = r * 3 + c;
      rows.push(
        <Square
          key={squaresIndex}
          value={square[squaresIndex]}
          onSquareClick={() => {
            handleClick(squaresIndex);
          }}
        />,
      );
    }
    squareList.push(
      <div key={r} className="board_row">
        {rows}
      </div>,
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {squareList}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isToggled, setIsToggled] = useState(false);
  const currentSquare = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((square, move) => {
    const isCurrentMove = move === currentMove;
    const descritption = isCurrentMove
      ? move === 0
        ? "Start your Game"
        : "You are at move# " + move
      : move === 0
        ? "Go to game Start"
        : "Go to move# " + move;
    return (
      <li key={move}>
        {!isCurrentMove ? (
          <button
            onClick={() => {
              jumpTo(move);
            }}
          >
            {descritption}
          </button>
        ) : (
          descritption
        )}
      </li>
    );
  });

  const orderedMoves = isToggled ? moves.toReversed() : moves;

  function handlePlay(nextSquare) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquare];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} square={currentSquare} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setIsToggled(!isToggled)}>
          Sort: {isToggled ? "Ascending" : "Descending"}
        </button>
        <ol>{orderedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(square) {
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

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (square[a] && square[a] === square[b] && square[a] === square[c]) {
      return square[a];
    }
  }

  return null;
}
