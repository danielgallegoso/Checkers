var classNames = function(classes) {
  var result = "";
  for (var key in classes) {
    if (classes[key]) {
      result += key + " "
    }
  }
  return result
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    var board = [new Array(8), new Array(8), new Array(8), new Array(8), new Array(8), new Array(8), new Array(8), new Array(8)];
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        board[i][j] = 0;
      }
    }
    board[0][0] = 1;
    board[0][2] = 1;
    board[0][4] = 1;
    board[0][6] = 1;
    board[1][0] = 2;
    board[1][2] = 1;
    board[1][4] = 1;
    board[1][6] = 1;

    board[6][0] = 3;
    board[6][2] = 3;
    board[6][4] = 4;
    board[6][6] = 3;
    board[7][0] = 3;
    board[7][2] = 3;
    board[7][4] = 3;
    board[7][6] = 3;

    this.state = {
      board: board,
      selectedPiece: null,
    }

    this.onGridClick = this.onGridClick.bind(this);
  }

  onGridClick(e) {
    if (this.state.selectedPiece != e.currentTarget.id) {
      this.setState({selectedPiece: e.currentTarget.id});
    } else {
      this.setState({selectedPiece: null});
    }
  }

  render() {
    var board = new Array(8);
    for (var i = 0; i < 8; i++) {
      var row = new Array(8);
      for (var j = 0; j < 8; j++) {
        var id = i.toString() + j.toString();
        var gridClasses = classNames({
          "grid": true,
          "off-grid": (i - j) % 2 == 0,
          "selected-grid": this.state.selectedPiece == id,
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
