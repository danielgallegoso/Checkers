var classNames = function(classes) {
  var result = "";
  for (var key in classes) {
    if (classes[key]) {
      result += key + " ";
    }
  }
  return result;
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    var game = new checkersGame();
    var minimax = new minimaxAgent();
//     var tester =
// "00000000~\
// 00000000~\
// 00000000~\
// 00001010~\
// 00000000~\
// 00000000~\
// 00000003~\
// 00000000";
//
//     game.setBoard(tester);
    // console.log(game.board);
    // console.log('game.getLegalActions(1)')
    this.state = {
      game: game,
      minimax: minimax,
      board: game.board,
      selectedPiece: null,
      actions: game.getLegalActions(1),
      possibleActions: {},
      isWin: null,
    }
    // console.log(game.board);
    this.onGridClick = this.onGridClick.bind(this);
    this.getPossibleActions = this.getPossibleActions.bind(this);
    this.computersTurn = this.computersTurn.bind(this);
    this.checkIsWin = this.checkIsWin.bind(this);
  }

  computersTurn(game) {
    // console.log('game.getLegalActions(0)[0]')
    // var action = game.getLegalActions(0)[0];
    console.log(123)
    var action = this.state.minimax.getAction(game);
    console.log(action);
    // console.log('game.generateSuccessor(action,0)', action)
    return game.generateSuccessor(action,0);
  }

  checkIsWin(game, agentTurn) {
    // console.log('game.isWin')
    if (game.isWin(agentTurn) || game.isLose(agentTurn)) {

      this.setState({
        board: game.board,
        selectedPiece: null,
        possibleActions: {},
        isWin: agentTurn == 1 ? game.isWin(agentTurn) : !game.isWin(agentTurn),
      });
      return true;
    }
    return false;
  }

  // action: [starting point, intermediate states, ending point, piece taken]
  onGridClick(e) {
    // console.log("Click")
    if (this.state.isWin != null) {
      return;
    }
    var id = e.currentTarget.id;
    var value = this.state.board[parseInt(id[0])][parseInt(id[1])]
    if (value == 3 || value == 4) {
      if (this.state.selectedPiece != id) {
        this.setState({
          selectedPiece: id,
          possibleActions: this.getPossibleActions(id),
        });
      } else {
        this.setState({
          selectedPiece: null,
          possibleActions: {},
        });
      }
    } else if (Object.keys(this.state.possibleActions).indexOf(id) >= 0) {
      var i = Object.keys(this.state.possibleActions).indexOf(id)
      var action = this.state.possibleActions[Object.keys(this.state.possibleActions)[i]]
      // console.log('this.state.game.generateSuccessor(action, 1)', action)
      var tempGame = this.state.game.generateSuccessor(action, 1);
      if (this.checkIsWin(tempGame, 0)) return;
      var game = this.computersTurn(tempGame);
      if (this.checkIsWin(game, 1)) return;
      // console.log('game.getLegalActions(1)')
      this.setState({
        game: game,
        board: game.board,
        actions: game.getLegalActions(1),
        selectedPiece: null,
        possibleActions: {},
      });
    }
  }

  getId(i,j) {
    return i.toString() + j.toString();
  }

  getPossibleActions(id) {
    var result = {};
    for (var i in this.state.actions) {
      var action = this.state.actions[i];
      if (this.getId(action[0][1], action[0][0]) == id) {
        var endId = this.getId(action[action.length - 2][1], action[action.length - 2][0]);
        result[endId] = action;
      }
    }
    return result;
  }

  render() {
    // console.log(this.state.board);
    var board = new Array(8);
    for (var i = 0; i < 8; i++) {
      var row = new Array(8);
      for (var j = 0; j < 8; j++) {
        var id = this.getId(i,j);
        var gridClasses = classNames({
          "grid": true,
          "off-grid": (i - j) % 2 == 0,
          "selected-grid": this.state.selectedPiece == id,
          "possible-action": Object.keys(this.state.possibleActions).indexOf(id) >= 0,
        });
        var piece = null;
        if (this.state.board[i][j] != 0) {
          var pieceClasses = classNames({
            "piece": true,
            "red-normal": this.state.board[i][j] == 1,
            "red-king": this.state.board[i][j] == 2,
            "black-normal": this.state.board[i][j] == 3,
            "black-king": this.state.board[i][j] == 4,
          });
          piece = <div className={pieceClasses} />;
        }
        row[j] = (
          <div className={gridClasses} id={id} onClick={this.onGridClick} key={j}>
            {piece}
          </div>
        );
      }
      board[i] = (
        <div className="row" key={i}>
          {row}
        </div>
      );
    }
    var win;
    if (this.state.isWin == true) {
      win = <p>You won</p>;
    } else if (this.state.isWin == false) {
      win = <p>You lost</p>;
    }

    return (
      <div>
        {board}
        {win}
      </div>
    );
  }

}
