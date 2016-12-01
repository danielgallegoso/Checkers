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
      selectedPiece: null,
      actions: [[[6, 0], [7, 1], 1]],
      possibleActions: {}
    };

    _this.onGridClick = _this.onGridClick.bind(_this);
    _this.getPossibleActions = _this.getPossibleActions.bind(_this);
    return _this;
  }

  // action: [starting point, intermediate states, ending point, piece taken]


  _createClass(Board, [{
    key: "onGridClick",
    value: function onGridClick(e) {
      var id = e.currentTarget.id;
      var value = this.state.board[parseInt(id[0])][parseInt(id[1])];
      if (value == 3 || value == 4) {
        if (this.state.selectedPiece != id) {
          this.setState({
            selectedPiece: id,
            possibleActions: this.getPossibleActions(id)
          });
        } else {
          this.setState({
            selectedPiece: null,
            possibleActions: {}
          });
        }
      } else if (Object.keys(this.state.possibleActions).indexOf(id) >= 0) {
        var i = Object.keys(this.state.possibleActions).indexOf(id);
        var action = this.state.possibleActions[Object.keys(this.state.possibleActions)[i]];
        this.setState({
          selectedPiece: null,
          possibleActions: {}
        });
        console.log("Choose action: ", action);
        console.log("computer's turn");
      }
    }
  }, {
    key: "getId",
    value: function getId(i, j) {
      return i.toString() + j.toString();
    }
  }, {
    key: "getPossibleActions",
    value: function getPossibleActions(id) {
      var result = {};
      for (var i in this.state.actions) {
        var action = this.state.actions[i];
        if (this.getId(action[0][0], action[0][1]) == id) {
          var endId = this.getId(action[action.length - 2][0], action[action.length - 2][1]);
          result[endId] = action;
        }
      }
      return result;
    }
  }, {
    key: "render",
    value: function render() {
      var board = new Array(8);
      for (var i = 0; i < 8; i++) {
        var row = new Array(8);
        for (var j = 0; j < 8; j++) {
          var id = this.getId(i, j);
          var gridClasses = classNames({
            "grid": true,
            "off-grid": (i - j) % 2 == 0,
            "selected-grid": this.state.selectedPiece == id,
            "possible-action": Object.keys(this.state.possibleActions).indexOf(id) >= 0
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