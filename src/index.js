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
        key={i}
      />
    );
  }

  render() {
    return (
      <div>
        {Array(3).fill(null).map( (row, i) => (
          <div className="board-row" key={i}>
            {Array(3).fill(null).map( (e, j) => (
                this.renderSquare(3*i+j)
            ))}
          </div>
        ))}
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
        location: Array(2).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      ascendingHistory: true,
    }
  }

  handleClick(i){
    /* 
    El slice es pa que me lo duplique
    Remmember that state follows SOLID principles. It is not mutated directly
    This is useful in React because:
      Not mutating the state directly allows us to store previous states and go back ot them
      Detecting changes is easier using const
    */ 
    //  slicing the history at the current step number dropes the future history
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    const column = i % 3;
    const row = Math.floor(i / 3);
    const location = [column,row]

    this.setState({
      // Unlike the push() method, the concat() method doesn't mutate the original Array. Userful for SOLID
      history: history.concat([{
        squares: squares,
        location: location,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  handleClickToggle(){
    const ascendingHistory = this.state.ascendingHistory;
    this.setState({
      ...this.state,
      ascendingHistory: !ascendingHistory,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)

    // Step refers to the current history element
    // move refers to the current history element index
    const moves = history.map((step, move) => {
      const location_display = '(' + step.location[0] + ',' + step.location[1] + ')'
      const description = move ? 'Go to move #' + move + ' ' + location_display: 'Go to game start';
      const bold = this.state.stepNumber == move;
      return (
        /* 
        When rendering a <li/> React uses 'key' to differentiate which list elements have been changed
        This is useful so React only updates the changed elements and reuses/moves the unchanging elements
        Usually, the Array index is not a good key. Because the array can be reordered.
        Here it's okay to use it because we're not reordering the Array
         */
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {/* This is a way to do conditional rendering for simple elements */}
            {bold && <b>{description}</b>}
            {!bold && description}
          </button>
        </li>
      );
    })
    if (!this.state.ascendingHistory){moves.reverse();}

    let status;
    if (winner) {
      status = 'Winner ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    const historyToggleMessage = this.state.ascendingHistory ? 'Sort history in descending order' : 'Sort history in ascending order'
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
          <button onClick={() => this.handleClickToggle()}>{historyToggleMessage}</button>
          <ol>{moves}</ol>
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