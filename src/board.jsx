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
    console.log(game.getLegalActions(1));
    this.state = {
      game: game,
      board: game.board,
      selectedPiece: null,
      actions: game.getLegalActions(1),
      possibleActions: {},
    }

    this.onGridClick = this.onGridClick.bind(this);
    this.getPossibleActions = this.getPossibleActions.bind(this);
  }


  // action: [starting point, intermediate states, ending point, piece taken]
  onGridClick(e) {
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
      this.setState({
        selectedPiece: null,
        possibleActions: {},
      });
      console.log("Choose action: ", action);
      console.log("computer's turn");
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
    return (
      <div>
        {board}
      </div>
    );
  }

}
