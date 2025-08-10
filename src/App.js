import { useState, useEffect } from "react";

//if setSquares is defined in parent Board component, then Square component can access it via props only.
//direct access to setSquares from Square component is not possible.
function Square({value, onSquareClick, isWinner}) {
  
  const buttonClass = isWinner ? 'square-striked' : value === 'X' ? 'square-x' : value === 'O' ? 'square-o' : 'square';

  return (
    <>
        <button className={buttonClass} onClick={onSquareClick}>{value}</button>
    </>
  )
}

export default function Board() {

  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winningCombination, setWinningCombination] = useState([]);

  function handleClick(index) {

    if(squares[index]) {
      return; // If the square is already filled, do nothing
    }
    console.log("clicked!!");
    const newSquares = squares.slice(); // Create a copy of the squares array

    if(xIsNext) {
      newSquares[index] = 'X';
    }
    else {
      newSquares[index] = 'O'; 
    }

    setSquares(newSquares); // Update the state with the new array
    console.log(squares);
    setXIsNext(!xIsNext); // Toggle the turn
  }

  useEffect(() => {
    // This effect runs whenever squares changes
    // You can use this to check for a winner or perform other actions
    checkWinner();
  }, [squares]);

  useEffect(() => {
    if(winningCombination.length > 0) {
      setTimeout(() => {
        alert(`Winner is: ${squares[winningCombination[0]]}`);
      }, 100);
    }
  }, [winningCombination]);

  function checkWinner() {
      let {winner, winningCombination} = calculateWinner(squares);
      if(winner !== null) {
        setWinningCombination(winningCombination);
        return;
      }

      if(!squares.includes(null)) {
        alert("Game Over! It's a draw!");
      }
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

    for(let i=0; i<lines.length; i++) {
        const [a,b,c] = lines[i]; //0,1,2
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return {winner: squares[a], winningCombination: lines[i]};
        }
      }
      return {winner: null, winningCombination: []};
  }

  return (
    <>
      <div className="parent-container">
        <h1>Tic Tac Toe</h1>
        <div style={{marginBottom: "20px"}}>Next turn : Player {xIsNext?"X":"O"}</div>
        <div>
          <div className="board-row">
            <Square value={squares[0]} onSquareClick={() => {handleClick(0)}} isWinner={winningCombination.includes(0) ? true : false}/> 
            <Square value={squares[1]} onSquareClick={() => {handleClick(1)}} isWinner={winningCombination.includes(1) ? true : false}/> 
            <Square value={squares[2]} onSquareClick={() => {handleClick(2)}} isWinner={winningCombination.includes(2) ? true : false}/> 
          </div>
          <div className="board-row">
            <Square value={squares[3]} onSquareClick={() => {handleClick(3)}} isWinner={winningCombination.includes(3) ? true : false}/> 
            <Square value={squares[4]} onSquareClick={() => {handleClick(4)}} isWinner={winningCombination.includes(4) ? true : false}/> 
            <Square value={squares[5]} onSquareClick={() => {handleClick(5)}} isWinner={winningCombination.includes(5) ? true : false}/> 
          </div>
          <div className="board-row">
            <Square value={squares[6]} onSquareClick={() => {handleClick(6)}} isWinner={winningCombination.includes(6) ? true : false}/> 
            <Square value={squares[7]} onSquareClick={() => {handleClick(7)}} isWinner={winningCombination.includes(7) ? true : false}/> 
            <Square value={squares[8]} onSquareClick={() => {handleClick(8)}} isWinner={winningCombination.includes(8) ? true : false}/> 
          </div>
        </div>
        <div style={{marginTop: "20px"}}>
          <button onClick={() => { setSquares(Array(9).fill(null)); setXIsNext(true); setWinningCombination([]); }}>Reset</button>
        </div>
      </div>
    </>
  )
}
