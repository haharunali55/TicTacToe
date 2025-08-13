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

function Mode({onSPClick, onMPClick, isSPDisabled, isMPDisabled}) {

  return (
    <>
      <span>
        <button className="button2" onClick={onSPClick} disabled={isSPDisabled?true:false}><span>Single Player</span></button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button className="button2" onClick={onMPClick} disabled={isMPDisabled?true:false}><span>Multi Player</span></button>
      </span>
    </>
  );
}

export default function Board() {

  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winningCombination, setWinningCombination] = useState([]);
  const [isSinglePlayer, setIsSinglePlayer] = useState(false);
  const [isSPDisabled, setIsSPDisabled] = useState(false);
  const [isMPDisabled, setIsMPDisabled] = useState(false);

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

  function getBestIndex(squares) {
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
      const [a,b,c] = lines[i];
      if(squares[a] === 'O' && squares[b] === 'O' && squares[c] === null) {
        return c;
      }
      else if(squares[a] === 'O' && squares[c] === 'O' && squares[b] === null) {
        return b;
      }
      else if(squares[b] === 'O' && squares[c] === 'O' && squares[a] === null) {
        return a;
      }
    }

    // for loops are separated to ensure that computer does whats best for it first,
    // and then blocks the opponent's winning move.
    for(let i = 0; i < lines.length; i++) {
      const [a,b,c] = lines[i];
      if(squares[a] === 'X' && squares[b] === 'X' && squares[c] === null) {
        return c; // Return the index of the empty square to block the opponent
      }
      else if(squares[a] === 'X' && squares[c] === 'X' && squares[b] === null) {
        return b;
      }
      else if(squares[b] === 'X' && squares[c] === 'X' && squares[a] === null) {
        return a;
      }
    }

    // If no favourable move found, return a random empty square
    const randomIndex = getRandomIndex(squares);
    return randomIndex;
  }

  function getRandomIndex(squares) {
    // Filter out indices of empty squares
    const availableIndices = squares
      .map((value, index) => (value === null ? index : null))
      .filter(index => index !== null);
  
    // If no available indices, return null
    if (availableIndices.length === 0) {
      return null;
    }
  
    // Generate a random index from the available indices
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    return randomIndex;
  }

  useEffect(() => {
    // This effect runs whenever squares changes
    // You can use this to check for a winner.
    checkWinner();
  }, [squares]);

  useEffect(() => {
    if(winningCombination.length > 0) {
      setTimeout(() => {
        alert(`Winner is: ${squares[winningCombination[0]]}`);
      }, 100);
      return;
    }
    else if(!squares.includes(null)) {
      setTimeout(() => {
        alert(`Game Over! It's a draw!`);
      }, 100);
    }
    
    if(isSinglePlayer && !xIsNext && winningCombination.length === 0) {
      // Logic for computer's turn in single player mode
      let bestIndex = getBestIndex(squares);
      if(bestIndex !== null) {
        setTimeout(() => {
          handleClick(bestIndex);
        }, 500);
      }
    }
  }, [winningCombination]);

  function checkWinner() {
      let {winner, winningCombination} = calculateWinner(squares);
      if(winner !== null) {
        setWinningCombination(winningCombination);
        return;
      }
      else {
        setWinningCombination([]);
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

  let status = "";
  if(winningCombination.length > 0) {
    status = `Game Over! Winner : ${squares[winningCombination[0]]}`;
  }
  else {
    if(!squares.includes(null)) {
      status = `Game Over! It's a draw!`;
    }
    else {
      status = `Next turn : Player ${xIsNext ? "X" : "O"}`;
    }
  }

  return (
    <>
      <div className="parent-container">
        <h1>Tic Tac Toe</h1>

        <Mode onSPClick={() => {setIsSinglePlayer(true); setIsMPDisabled(true)}} onMPClick={() => {setIsSinglePlayer(false); setIsSPDisabled(true)}} isSPDisabled={isSPDisabled} isMPDisabled={isMPDisabled}/>

        <div style={{marginBottom: "10px", marginTop: "30px"}}>
          {/* <h3>{winningCombination.length>0 ? `Game Over! Winner : ${squares[winningCombination[0]]}` : `Next turn : Player ${xIsNext?"X":"O"}`}</h3> */}
          <h3>{status}</h3>
        </div>

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
          <button className="button" onClick={() => { setSquares(Array(9).fill(null)); setXIsNext(true); setWinningCombination([]); setIsSPDisabled(false); setIsMPDisabled(false); setIsSinglePlayer(false); }}>Reset</button>
        </div>
      </div>
    </>
  )
}
