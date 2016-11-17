"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var classNames = function classNames(classes) {
  var result = "";
  for (var key in classes) {
    if (classes[key]) {
      result += key + " ";
    }
  }
  return result;
};

var Board = function (_React$Component) {
  _inherits(Board, _React$Component);

  function Board(props) {
    _classCallCheck(this, Board);

    var _this = _possibleConstructorReturn(this, (Board.__proto__ || Object.getPrototypeOf(Board)).call(this, props));

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

    _this.state = {
      board: board,
      selectedPiece: null
    };

    _this.onGridClick = _this.onGridClick.bind(_this);
    return _this;
  }

  _createClass(Board, [{
    key: "onGridClick",
    value: function onGridClick(e) {
      if (this.state.selectedPiece != e.currentTarget.id) {
        this.setState({ selectedPiece: e.currentTarget.id });
      } else {
        this.setState({ selectedPiece: null });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var board = new Array(8);
      for (var i = 0; i < 8; i++) {
        var row = new Array(8);
        for (var j = 0; j < 8; j++) {
          var id = i.toString() + j.toString();
          var gridClasses = classNames({
            "grid": true,
            "off-grid": (i - j) % 2 == 0,
            "selected-grid": this.state.selectedPiece == id
          });
          var piece = null;
          if (this.state.board[i][j] != 0) {
            var pieceClasses = classNames({
              "piece": true,
              "red-normal": this.state.board[i][j] == 1,
              "red-king": this.state.board[i][j] == 2,
              "black-normal": this.state.board[i][j] == 3,
              "black-king": this.state.board[i][j] == 4
            });
            piece = React.createElement("div", { className: pieceClasses });
          }
          row[j] = React.createElement(
            "div",
            { className: gridClasses, id: id, onClick: this.onGridClick, key: j },
            piece
          );
        }
        board[i] = React.createElement(
          "div",
          { className: "row", key: i },
          row
        );
      }
      return React.createElement(
        "div",
        null,
        board
      );
    }
  }]);

  return Board;
}(React.Component);