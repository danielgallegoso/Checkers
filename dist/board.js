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

    var game = new checkersGame();
    var agent = new HandpickedMinimaxAgent(0);
    //   var agent = new SmallWeightedMinimaxAgent([ 2.04519378087059,
    // 7.898920885361369,
    // -8.896758901145976,
    // 7.537251410956124,
    // 0.03080404842152129,
    // 6.149634359806917,
    // -2.039683344044635,
    // -10.656070047537842 ], 0, 4);
    // var agent = new RandomAgent();
    // var agent = new NaiveMinimaxAgent();
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
    // console.log(game.board)
    // console.log('game.getLegalActions(1)')
    _this.state = {
      game: game,
      agent: agent,
      board: game.board,
      selectedPiece: null,
      actions: game.getLegalActions(1),
      possibleActions: {},
      isWin: null
    };
    // console.log(game.board);
    _this.onGridClick = _this.onGridClick.bind(_this);
    _this.getPossibleActions = _this.getPossibleActions.bind(_this);
    _this.computersTurn = _this.computersTurn.bind(_this);
    _this.checkIsWin = _this.checkIsWin.bind(_this);
    return _this;
  }

  _createClass(Board, [{
    key: "computersTurn",
    value: function computersTurn(game) {
      // console.log('game.getLegalActions(0)[0]')
      // var action = game.getLegalActions(0)[0];
      // console.log(123)
      var action = this.state.agent.getAction(game);
      // console.log(action);
      // console.log('game.generateSuccessor(action,0)', action)
      return game.generateSuccessor(action, 0);
    }
  }, {
    key: "checkIsWin",
    value: function checkIsWin(game, agentTurn) {
      // console.log('game.isWin')
      if (game.isWin(agentTurn) || game.isLose(agentTurn)) {

        this.setState({
          board: game.board,
          selectedPiece: null,
          possibleActions: {},
          isWin: agentTurn == 1 ? game.isWin(agentTurn) : !game.isWin(agentTurn)
        });
        return true;
      }
      return false;
    }

    // action: [starting point, intermediate states, ending point, piece taken]

  }, {
    key: "onGridClick",
    value: function onGridClick(e) {
      // console.log("Click")
      if (this.state.isWin != null) {
        return;
      }
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
          possibleActions: {}
        });
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
        if (this.getId(action[0][1], action[0][0]) == id) {
          var endId = this.getId(action[action.length - 2][1], action[action.length - 2][0]);
          result[endId] = action;
        }
      }
      return result;
    }
  }, {
    key: "render",
    value: function render() {
      // console.log(this.state.board);
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
      var win;
      if (this.state.isWin == true) {
        win = React.createElement(
          "p",
          null,
          "You won"
        );
      } else if (this.state.isWin == false) {
        win = React.createElement(
          "p",
          null,
          "You lost"
        );
      }

      return React.createElement(
        "div",
        null,
        board,
        win
      );
    }
  }]);

  return Board;
}(React.Component);