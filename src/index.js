/*
 * @Author: ikouane
 * @Date: 2023-02-06 14:24:31
 * @LastEditTime: 2023-02-07 17:51:46
 * @LastEditors: ikouane
 * @Description: 
 * @version: 
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className={(props.className ? 'winner' : '') + ' square'} onClick={props.onClick}>
      {props.value}
    </button>
  )
}
class Board extends React.Component {
  renderSquare(i) {
    return <Square
      key={i}
      value={this.props.squares[i]}
      className={this.props.winnerIndexArray?.includes(i)}
      onClick={() => { this.props.onClick(i) }}
    />;
  }

  render() {
    const rowCount = [0, 1, 2], columnCount = [0, 1, 2];
    return (
      <div>
        {rowCount.map((r, rowIndex) =>
          <div key={r} className="board-row">
            {
              columnCount.map((c, columnIndex) =>
                this.renderSquare(3 * rowIndex + columnIndex)
              )
            }
          </div>
        )}
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
      stepNumber: 0,
      xIsNext: true,
      historyPositiveOrder: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares,
        location: i + 1
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  switchHistoryShowOrder() {
    this.setState({
      historyPositiveOrder: !this.state.historyPositiveOrder
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  getActiveIndex(move) {
    return (this.state.stepNumber === (this.state.historyPositiveOrder ? move : this.state.history.length - move - 1) ? 'active' : '')
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)?.winner;
    const indexArray = calculateWinner(current.squares)?.index;

    const historyOrder = this.state.historyPositiveOrder ? history : history.concat().reverse();

    const moves = historyOrder.map((step, move) => {
      const desc = step.location ?
        'Go to move #' + move + `(${Math.ceil(step.location / 3)},${(step.location % 3 === 0) ? 3 : (step.location % 3)})` :
        'Go to game start';
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={this.getActiveIndex(move)}
          >{desc}</button>
        </li >
      )
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (this.state.stepNumber === 9) {
      status = 'Draw! Everyone wins!';
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winnerIndexArray={indexArray}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            className={this.state.historyPositiveOrder ? '' : 'reverse'}
            onClick={() => this.switchHistoryShowOrder()}
          >↓</button>
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
      return {
        winner: squares[a],
        index: [a, b, c]
      };
    }
  }
  return null;
}

// https://zh-hans.reactjs.org/tutorial/tutorial.html
// 如果你还有充裕的时间，或者想练习一下刚刚学会的 React 新技能，这里有一些可以改进游戏的想法供你参考，这些功能的实现顺序的难度是递增的：

// 在游戏历史记录列表显示每一步棋的坐标，格式为(列号, 行号)。
// 在历史记录列表中加粗显示当前选择的项目。
// 使用两个循环来渲染出棋盘的格子，而不是在代码里写死（hardcode）。
// 添加一个可以升序或降序显示历史记录的按钮。
// 每当有人获胜时，高亮显示连成一线的 3 颗棋子。
// 当无人获胜时，显示一个平局的消息。