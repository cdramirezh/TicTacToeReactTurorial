import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Since the squares are CONTROLLED COMPONENTS, controlled by the board,
// then we can make them simple. Define the Square as a funciton
function Square(props) {
  return (
    <button 
      className="square"
      // Passing an anonymous or arrow functions in neccessary.
      // Otherwise, the onClick will fire every time the component is rendered
      // onClick={() => {this.props.onClick()}}
      // When I'm inside a function Component instead of a regular Component, then I don't need the arrow. Weird, huh
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
/*   
  // Constructor is helplfull to initialize the state
  constructor(props){
    // In Js calling the father super() is always neccesary
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
 */

  renderSquare(i) {
    /*
    If a parethesis ater a multiple line return is not added,
    then JS will insert a semicolon after the return and break the code.
    It'll return nothing
    */
    return (
      <Square
        value={this.props.squares[i]}
        // In React it's conventional to use onEvent for properties that represent events.
        // And handleEvent for methods that which handle such events
        // Remmember that without the arrow the function is called
        // in every render instead of passed to the child
        onClick={() => {this.props.onClick(i)}}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    }
  }

  handleClick(i){
    /* 
    Remmember that state follows SOLID principles. It is not mutated directly
    This is useful in React because:
      Not mutating the state directly allows us to store previous states and go back ot them
      Detecting changes is easier using const
    */ 
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      // Unlike the push() method, the concat() method doesn't mutate the original Array. Userful for SOLID
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares)
    let status;
    if (winner) {
      status = 'Winner ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}