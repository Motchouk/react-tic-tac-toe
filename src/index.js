import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                key={'square'+i}
                id={'square'+i}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
    
    createBoard() {
        let boardrows = [];
        let cellKey = 0;
        for (let i = 0; i < 3; i++) {
            let cells = [];
            
            for (let j = 0; j < 3; j++) {
                let square = this.renderSquare(cellKey);
                cellKey++;
                cells.push(square);
            }
            
            boardrows.push(<div className="board-row">{cells}</div>);
        }
        
        return boardrows;
    }

    render() {
        return (
            <div>
                {this.createBoard()}
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
                moves: []
            }],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        let moves;

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        moves = [{
            player: squares[i],
            line: getCaseLine(i),
            column: getCaseColumn(i)
        }];

        this.setState({
            history: history.concat([{
                squares: squares,
                moves: moves
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setBold(step);

        let squares = [].slice.call(document.querySelectorAll(".square"));

        squares.forEach(function (square, index) {
            square.classList.remove('victory');
        });

        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    setBold(step) {
        let liTag = document.querySelector('#move_' + step);
        let liTagActive = document.querySelector('.move.active');

        if (null !== liTagActive) {
            liTagActive.classList.remove('active');
        }

        liTag.classList.add("active");
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const isDraw = isGameDraw(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';


            if (move > 0) {
                return (
                    <li key={'move_' + move} id={'move_' + move} className={'move'}>
                        <button onClick={() => this.jumpTo(move)}>{desc} : {step.moves[0]['player']} ({step.moves[0]['line']}, {step.moves[0]['column']})</button>
                    </li>
                );
            }
            return (
                <li key={'move_' + move} id={'move_' + move} className={'move'}>
                    <button onClick={() => this.jumpTo(move)}>{desc} : </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (isDraw) {
            status = 'Draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }


        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
            highlightWinner(lines[i]);
            return squares[a];
        }
    }
    return null;
}

function highlightWinner(squareNumbers) {
    let squares = [].slice.call(document.querySelectorAll(".square"));

    squares.forEach(function (square, index) {
        if (-1 !== squareNumbers.indexOf(index)) {
            square.classList.add('victory');
        }
        else {
            console.log('Case n° ' + index);
        }
    });

}

function isGameDraw(squares) {
    for (let i = 0; i < squares.length; i++) {
        // If one square is empty, there is no draw yet
        if (!squares[i]) {
            return false;
        }
    }

    if (null === calculateWinner(squares)) {
        return true;
    }

    return false;
}

function getCaseLine(i) {
    const lines = [
        1, 1, 1,
        2, 2, 2,
        3, 3, 3
    ];

    return lines[i];
}

function getCaseColumn(i) {
    const lines = [
        1, 2, 3,
        1, 2, 3,
        1, 2, 3
    ];

    return lines[i];
}