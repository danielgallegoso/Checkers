//Scroll to the bottom to see the relevant code. Javascript does not let you import
//files so we had to copy in a lot of code


class checkersGame {
    //This class will make the state for our minimax problem
    //Agent - 0 is the red, the bottom rows
    //Agent - 1 is black, the top rows
    // 1 - Red player
    // 2 - Red king
    // 3 - Black player
    // 4 - Black king

    constructor() {
        this.WIDTH = 8;
        this.HEIGHT = 8;
        this.numRedPieces = 13;
        this.numBlackPieces = 13;
        this.board = new Array(8); // this.agent!
        for (var i = 0; i < 8; i++) {
            this.board[i] = new Array(8);
        }
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                this.board[i][j] = 0;
            }
        }
        for (var i = 0; i < 3; i++){
            for(var j = (1 + i)%2; j < 8; j+=2) {
                this.board[i][j] = 1;
            }
        }
        for (var i = 5; i < 8; i++){
            for(var j = (i+1)%2; j < 8; j+=2) {
                this.board[i][j] = 3;
            }
        }

        //Binding
        this.isWin = this.isWin.bind(this);
        this.isLose = this.isLose.bind(this);
        this.getScore = this.getScore.bind(this);

        this.generateSuccessor = this.generateSuccessor.bind(this);
        this.getLegalActions = this.getLegalActions.bind(this);
        this.inBounds = this.inBounds.bind(this);
        this.recursiveEatSearch = this.recursiveEatSearch.bind(this);

        this.setBoard = this.setBoard.bind(this);

    }

    isWin(agent) {
        if (agent  == 0) {
            if (this.numBlackPieces == 0 || this.getLegalActions(1).length == 0) {
                return true;
            }
        } else if (agent == 1) {
            if(this.numRedPieces == 0 || this.getLegalActions(0).length == 0) {
                return true;
            }
        }
        return false;
    }

    isLose(agent) {
        if (agent  == 0) {
            if (this.numRedPieces == 0 || this.getLegalActions(agent).length == 0) {
                return true;
            }
        } else if (agent == 1) {
            if(this.numBlackPieces == 0 || this.getLegalActions(agent).length == 0) {
                return true;
            }
        }
        return false;
    }

    inBounds(x, y) {
        if (x >= 0 && x < this.WIDTH && y >= 0 && y < this.HEIGHT) {
            return true;
        }
        return false;
    }

    getScore() {
        if (this.isWin(0)) {
            return Infinity;
        } else if(this.isWin(1)) {
            return (0 - Infinity);
        } else {
            return this.numRedPieces - this.numBlackPieces;
        }
    }

    setBoard(input) {
        var inputArray = input.split("~");
        //console.log(inputArray);
        for (var i = 0; i < inputArray.length; i++) {
            //console.log(inputArray[i]);
            for (var j = 0; j < inputArray[i].length; j++) {
              //console.log(i + " " + j);
                this.board[i][j] = parseInt(inputArray[i][j]);
            }
        }
    }

    // action = [[(0,0), ... , (4,4)], 1]
    // If the second element of the array is 1, then the action involves eating pieces
    // If not, then the action does not involve eating pieces.

    generateSuccessor(action, agent, turtles = 0) {
        var state = new checkersGame();
        state.numRedPieces = this.numRedPieces;
        state.numBlackPieces = this.numBlackPieces;
        for(var x = 0; x < this.WIDTH; x++) {
            for(var y = 0; y < this.HEIGHT; y++) {
                state.board[y][x] = this.board[y][x]
            }
        }

        var firstMove = action[0];
        var lastMove = action[action.length - 2];
        var eating = action[action.length - 1];

        if(eating == 0) {
            if (turtles == 1) {
              console.log(agent, lastMove);
            }
            state.board[lastMove[1]][lastMove[0]] = state.board[firstMove[1]][firstMove[0]];
            if(agent == 0 && lastMove[1] == 7) {
                state.board[lastMove[1]][lastMove[0]]=2;
            } else if(agent == 1 && lastMove[1] == 0) {
              if (turtles == 1) {
                console.log("turtles");
              }
              state.board[lastMove[1]][lastMove[0]]=4;
            }
            state.board[firstMove[1]][firstMove[0]] = 0;
        } else {
            if (turtles == 1) {
              console.log(agent, lastMove);
            }
            var containsUpgrade = false;
            for (var i = 0; i < action.length - 2; i ++) {
                var first = action[i];
                var second = action[i+1];
                // console.log('x:', (first[1] + second[1]) / 2, ' y:', (first[0] + second[0]) / 2);
                state.board[(first[1] + second[1]) / 2][(first[0] + second[0]) / 2] = 0;
                if (agent == 0 && second[1] == 7) {
                    containsUpgrade = true;
                    if (turtles == 1) {
                      console.log("turtles");
                    }
                } else if (agent == 1 && second[1] == 0) {
                    containsUpgrade = true;
                    if (turtles == 1) {
                      console.log("turtles");
                    }
                }
            }
            state.board[lastMove[1]][lastMove[0]] = state.board[firstMove[1]][firstMove[0]];
            state.board[firstMove[1]][firstMove[0]] = 0;

            if (agent == 0 ){
                state.numBlackPieces = state.numBlackPieces - action.length + 2;
                if (containsUpgrade) {
                    state.board[lastMove[1]][lastMove[0]] = 2;
                }
            } else {
                state.numRedPieces = state.numRedPieces - action.length + 2;
                if (containsUpgrade) {
                    state.board[lastMove[1]][lastMove[0]] = 4;
                }
            }
        }

        return state;
    }

    getLegalActions(agent) {
        var actions = []
        if (agent == 0) {
            for(var x = 0; x < this.WIDTH; x++) {
                for(var y = 0; y < this.HEIGHT; y ++) {
                    if(this.board[y][x] == 1 || this.board[y][x] == 2) {
                        var path = [[x,y]];
                        var numActions = actions.length;
                        this.recursiveEatSearch(x, y, this.board[y][x], actions, path);
                        if (actions.length > numActions) {
                            continue;
                        }

                        if (this.inBounds(y+1, x+1) && this.board[y+1][x+1]==0) {
                            actions.push([[x,y],[x+1,y+1],0]);
                        }
                        if (this.inBounds(y+1, x-1) && this.board[y+1][x-1]==0) {
                            actions.push([[x, y],[x-1,y+1],0]);
                        }
                    } if(this.board[y][x] == 2) {
                        if (this.inBounds(y-1, x+1) && this.board[y-1][x+1]==0) {
                            actions.push([[x,y],[x+1,y-1],0]);
                        }
                        if (this.inBounds(y-1, x-1) && this.board[y-1][x-1]==0) {
                            actions.push([[x, y],[x-1,y-1],0]);
                        }
                    }
                }
            }
        } else if (agent == 1) {
            for(var x = 0; x < this.WIDTH; x++) {
                for(var y = 0; y < this.HEIGHT; y ++) {
                    if(this.board[y][x] == 3 || this.board[y][x] == 4) {
                        var path = [[x,y]];
                        var numActions = actions.length;
                        this.recursiveEatSearch(x, y, this.board[y][x], actions, path);
                        if (actions.length > numActions) {
                            continue;
                        }

                        if (this.inBounds(y-1, x+1) && this.board[y-1][x+1]==0) {
                            actions.push([[x,y],[x+1,y-1],0]);
                        }
                        if (this.inBounds(y-1, x-1) && this.board[y-1][x-1]==0) {
                            actions.push([[x, y],[x-1,y-1],0]);
                        }
                    } if(this.board[y][x] == 4) {
                        if (this.inBounds(y+1, x+1) && this.board[y+1][x+1]==0) {
                            actions.push([[x,y],[x+1,y+1],0]);
                        }
                        if (this.inBounds(y+1, x-1) && this.board[y+1][x-1]==0) {
                            actions.push([[x, y],[x-1,y+1],0]);
                        }
                    }
                }
            }
        }
        var canEat = false;
        for (var i = 0; i < actions.length; i++) {
            var action = actions[i];
            if (action[action.length - 1] == 1) {
                canEat = true;
            }
        }
        if (canEat) {
            for(var i = 0; i <actions.length; i++) {
                var action = actions[i];
                if (action[action.length - 1] == 0) {
                    actions.splice(i, 1);
                    i--;
                }
            }
        }
        return actions;
    }

    recursiveEatSearch(x, y, piece, actions, path) {
        if(piece == 1) {
            var foundMove = false;
            //if (y+2 == 7) {
                //console.log('upgrade?');
            //    piece = 2;
            //}
            if (this.inBounds(y+1, x+1) && this.board[y+1][x+1]>2 && this.inBounds(y+2, x+2) && this.board[y+2][x+2]==0) {
                foundMove = true;
                path.push([x+2, y+2]);
                var oldValue = this.board[y+1][x+1];

                this.board[y+1][x+1] = 0;
                this.recursiveEatSearch(x+2, y+2, piece, actions, path);
                this.board[y+1][x+1] = oldValue

                path.pop();
            }
            if (this.inBounds(y+1, x-1) && this.board[y+1][x-1]>2 && this.inBounds(y+2, x-2) && this.board[y+2][x-2]==0) {
                foundMove = true;
                path.push([x-2, y+2]);
                var oldValue = this.board[y+1][x-1];
                this.board[y+1][x-1] = 0;
                this.recursiveEatSearch(x-2, y+2, piece, actions, path);
                this.board[y+1][x-1] = oldValue;
                path.pop();
            }
            if(!foundMove && path.length > 1) {
                //console.log(path);

                var pathCopy = [];
                for (var i = 0; i < path.length; i++) {
                    pathCopy.push(path[i])
                }
                pathCopy.push(1)
                actions.push(pathCopy);

                //console.log(actions);
            }
        } else if (piece == 2) {
            var foundMove = false;
            if (this.inBounds(y+1, x+1) && this.board[y+1][x+1]>2 && this.inBounds(y+2, x+2) && this.board[y+2][x+2]==0) {
                foundMove = true;
                path.push([x+2, y+2]);
                var oldValue = this.board[y+1][x+1];
                this.board[y+1][x+1] = 0;
                this.recursiveEatSearch(x+2, y+2, piece, actions, path);
                this.board[y+1][x+1] = oldValue;
                path.pop();
            }
            if (this.inBounds(y+1, x-1) && this.board[y+1][x-1]>2 && this.inBounds(y+2, x-2) && this.board[y+2][x-2]==0) {
                foundMove = true;
                path.push([x-2, y+2]);
                var oldValue = this.board[y+1][x-1];
                this.board[y+1][x-1] = 0;
                this.recursiveEatSearch(x-2, y+2, piece, actions, path);
                this.board[y+1][x-1] = oldValue;
                path.pop();
            }
            if (this.inBounds(y-1, x+1) && this.board[y-1][x+1]>2 && this.inBounds(y-2, x+2) && this.board[y-2][x+2]==0) {
                foundMove = true;
                path.push([x+2, y-2]);
                var oldValue = this.board[y-1][x+1];
                this.board[y-1][x+1] = 0;
                this.recursiveEatSearch(x+2, y-2, piece, actions, path);
                this.board[y-1][x+1] = oldValue
                path.pop();
            }
            if (this.inBounds(y-1, x-1) && this.board[y-1][x-1]>2 && this.inBounds(y-2, x-2) && this.board[y-2][x-2]==0) {
                foundMove = true;
                path.push([x-2, y-2]);
                var oldValue = this.board[y-1][x-1];
                this.board[y-1][x-1] = 0;
                this.recursiveEatSearch(x-2, y-2, piece, actions, path);
                this.board[y-1][x-1] = oldValue;
                path.pop();
            }
            if(!foundMove && path.length > 1) {
                //console.log(path);

                var pathCopy = [];
                for (var i = 0; i < path.length; i++) {
                    pathCopy.push(path[i])
                }
                pathCopy.push(1)
                actions.push(pathCopy);

                //console.log(actions);
            }
        } else if(piece == 3) {
            var foundMove = false;
            //if (y-2 == 0) {
                //console.log('upgrade?')
                //piece = 4
            //}
            if (this.inBounds(y-1, x+1) && (this.board[y-1][x+1]==1 || this.board[y-1][x+1]==2)  && this.inBounds(y-2, x+2) && this.board[y-2][x+2]==0) {
                foundMove = true;
                path.push([x+2, y-2]);
                var oldValue = this.board[y-1][x+1];
                this.board[y-1][x+1] = 0;
                this.recursiveEatSearch(x+2, y-2, piece, actions, path);
                this.board[y-1][x+1] = oldValue
                path.pop();
            }
            if (this.inBounds(y-1, x-1) && (this.board[y-1][x-1]==1 || this.board[y-1][x-1]==2) && this.inBounds(y-2, x-2) && this.board[y-2][x-2]==0) {
                foundMove = true;
                path.push([x-2, y-2]);
                var oldValue = this.board[y-1][x-1];
                this.board[y-1][x-1] = 0;
                this.recursiveEatSearch(x-2, y-2, piece, actions, path);
                this.board[y-1][x-1] = oldValue;
                path.pop();
            }
            if(!foundMove && path.length > 1) {
                //console.log(path);

                var pathCopy = [];
                for (var i = 0; i < path.length; i++) {
                    pathCopy.push(path[i])
                }
                pathCopy.push(1)
                actions.push(pathCopy);

                //console.log(actions);
            }
        } else if (piece == 4) {
            var foundMove = false;
            if (this.inBounds(y+1, x+1) && (this.board[y+1][x+1] == 1 || this.board[y+1][x+1] == 2) && this.inBounds(y+2, x+2) && this.board[y+2][x+2]==0) {
                foundMove = true;
                path.push([x+2, y+2]);
                var oldValue = this.board[y+1][x+1];
                this.board[y+1][x+1] = 0;
                this.recursiveEatSearch(x+2, y+2, piece, actions, path);
                this.board[y+1][x+1] = oldValue;
                path.pop();
            }
            if (this.inBounds(y+1, x-1) && (this.board[y+1][x-1] == 2 || this.board[y+1][x-1] == 1) && this.inBounds(y+2, x-2) && this.board[y+2][x-2]==0) {
                foundMove = true;
                path.push([x-2, y+2]);
                var oldValue = this.board[y+1][x-1];
                this.board[y+1][x-1] = 0;
                this.recursiveEatSearch(x-2, y+2, piece, actions, path);
                this.board[y+1][x-1] = oldValue;
                path.pop();
            }
            if (this.inBounds(y-1, x+1) && (this.board[y-1][x+1] == 1 || this.board[y-1][x+1] == 2) && this.inBounds(y-2, x+2) && this.board[y-2][x+2]==0) {
                foundMove = true;
                path.push([x+2, y-2]);
                var oldValue = this.board[y-1][x+1];
                this.board[y-1][x+1] = 0;
                this.recursiveEatSearch(x+2, y-2, piece, actions, path);
                this.board[y-1][x+1] = oldValue
                path.pop();
            }
            if (this.inBounds(y-1, x-1) && (this.board[y-1][x-1] == 1 || this.board[y-1][x-1] == 2) && this.inBounds(y-2, x-2) && this.board[y-2][x-2]==0) {
                foundMove = true;
                path.push([x-2, y-2]);
                var oldValue = this.board[y-1][x-1];
                this.board[y-1][x-1] = 0;
                this.recursiveEatSearch(x-2, y-2, piece, actions, path);
                this.board[y-1][x-1] = oldValue;
                path.pop();
            }
            if(!foundMove && path.length > 1) {
                //console.log(path);

                var pathCopy = [];
                for (var i = 0; i < path.length; i++) {
                    pathCopy.push(path[i])
                }
                pathCopy.push(1)
                actions.push(pathCopy);

                //console.log(actions);
            }
        }
    }
}
class FastFactors {
  constructor(state) {
    this.vnumberOfPawns = 0;
    this.vnumberOfKings = 0;
    this.vnumSafePawns = 0;
    this.vnumSafeKings = 0;
    this.vnumDefenders = 0;
    this.vnumAttackers = 0;
    this.vnumCentralPawns = 0;
    this.vnumCentralKings = 0;
    this.isEndgame = 0;
    if (state.numRedPieces <= 5 || state.numBlackPieces <= 5) {
        this.isEndgame = 1;
    }

    for (var x = 0; x < state.WIDTH; x++) {
        for (var y = 0; y < state.HEIGHT; y++) {
            // numberOfPawns
            if (state.board[x][y] == 1) {
                this.vnumberOfPawns--;
            } else if (state.board[x][y] == 3) {
                this.vnumberOfPawns++;
            }
            // numberOfKings
            if (state.board[x][y] == 2) {
                this.vnumberOfPawns--;
            } else if (state.board[x][y] == 4) {
                this.vnumberOfPawns++;
            }
            // numSafePawns
            if (x == 0 || x == 7 || y == 0 || y == 7) {
                if (state.board[x][y] == 1) {
                  this.vnumSafePawns--;
                } else if (state.board[x][y] == 3) {
                    this.vnumSafePawns++;
                }
            }
            // numSafeKings
            if (x == 0 || x == 7 || y == 0 || y == 7) {
                if (state.board[x][y] == 2) {
                    this.vnumSafeKings--;
                } else if (state.board[x][y] == 4) {
                    this.vnumSafeKings++;
                }
            }
            // numDefenders
            if (y == state.HEIGHT || y == (state.HEIGHT - 1)) {
                if (state.board[y][x] == 1 || state.board[y][x] == 2) {
                    this.vnumDefenders++;
                }
            }
            if (y == 0 || y == 1) {
                if (state.board[y][x] == 3 || state.board[y][x] == 4) {
                    this.vnumDefenders--;
                }
            }
            // numAttackers
            if (y == 0 || y == 1 || y == 2) {
                if (state.board[y][x] == 1 || state.board[y][x] == 2) {
                    this.vnumAttackers++;
                }
            }
            if (y == state.HEIGHT || y == (state.HEIGHT - 1) || y == (state.HEIGHT - 2)) {
                if (state.board[y][x] == 3 || state.board[y][x] == 4) {
                    this.vnumAttackers--;
                }
            }
            // numCentralPawns
            if (x >= 3 && x <= 6 && y >= 3 && y <= 6) {
                if (state.board[y][x] == 1) {
                    this.vnumCentralPawns--;
                } else if (state.board[y][x] == 3) {
                    this.vnumCentralPawns++;
                }
            }
            // numCentralKings
            if (x >= 3 && x <= 6 && y >= 3 && y <= 6) {
                if (state.board[y][x] == 2) {
                    this.vnumCentralKings--;
                } else if (state.board[y][x] == 4) {
                    this.vnumCentralKings++;
                }
            }
        }
    }
  }

  numberOfPawns(agent) {
    return this.vnumberOfPawns * (agent * 2 - 1);

  }
  numberOfKings(agent) {
    return this.vnumberOfKings * (agent * 2 - 1);

  }
  numSafePawns(agent) {
    return this.vnumSafePawns * (agent * 2 - 1);

  }
  numSafeKings(agent) {
    return this.vnumSafeKings * (agent * 2 - 1);

  }
  numDefenders(agent) {
    return this.vnumDefenders * (agent * 2 - 1);

  }
  numAttackers(agent) {
    return this.vnumAttackers * (agent * 2 - 1);

  }
  numCentralPawns(agent) {
    return this.vnumCentralPawns * (agent * 2 - 1);

  }
  numCentralKings(agent) {
    return this.vnumCentralKings * (agent * 2 - 1);
  }
  numSafePawnsEnd(agent) {
    return this.vnumSafePawns * (agent * 2 - 1) * this.isEndgame;

  }
  numSafeKingsEnd(agent) {
    return this.vnumSafeKings * (agent * 2 - 1) * this.isEndgame;

  }
  numDefendersEnd(agent) {
    return this.vnumDefenders * (agent * 2 - 1) * this.isEndgame;

  }
  numAttackersEnd(agent) {
    return this.vnumAttackers * (agent * 2 - 1) * this.isEndgame;

  }
  numCentralPawnsEnd(agent) {
    return this.vnumCentralPawns * (agent * 2 - 1) * this.isEndgame;

  }
  numCentralKingsEnd(agent) {
    return this.vnumCentralKings * (agent * 2 - 1) * this.isEndgame;
  }

  eightFactorArray(agent) {
    return [
      this.numberOfPawns(agent),
      this.numberOfKings(agent),
      this.numSafePawns(agent),
      this.numSafeKings(agent),
      this.numDefenders(agent),
      this.numAttackers(agent),
      this.numCentralPawns(agent),
      this.numCentralKings(agent),
    ];
  }

  eightFactorArrayEnd(agent) {
    return [
      this.numberOfPawns(agent),
      this.numberOfKings(agent),
      this.numSafePawns(agent),
      this.numSafeKings(agent),
      this.numDefenders(agent),
      this.numAttackers(agent),
      this.numCentralPawns(agent),
      this.numCentralKings(agent),
      this.numSafePawnsEnd(agent),
      this.numSafeKingsEnd(agent),
      this.numDefendersEnd(agent),
      this.numAttackersEnd(agent),
      this.numCentralPawnsEnd(agent),
      this.numCentralKingsEnd(agent),
    ];
  }
}
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

class minimaxAgent {
    constructor(evalFunc, depth, agent) {
        this.depth = depth;
        this.evalFunc = evalFunc;
        this.agent = agent
    }

    getAction(checkersState) {
        var self = this;
        var get_best_action = function (checkersState, depth, max_depth, turn, agent, alpha_beta) { //eval function in state
            if (checkersState.isWin(turn) == true || checkersState.isLose(turn) == true) {
                var score = null;
                if (turn == 0) {
                    score = checkersState.getScore();
                } else {
                    score = 0 - checkersState.getScore();
                }
                return [null, score];
            }
            var legal_actions = checkersState.getLegalActions(turn);
            shuffle(legal_actions);
            var next_states = [];
            for (var i in legal_actions) {
              next_states.push(checkersState.generateSuccessor(legal_actions[i], turn));
            }
            var best_action = null;
            var best_score = null;

            if (turn == agent) { // maximize!
                for (var i = 0; i < next_states.length; i++) {
                    var next_state = next_states[i];
                    if ((alpha_beta[1] - alpha_beta[0]) > 0) {
                        var next_score = null
                        if (depth == max_depth) {
                          next_score = self.evalFunc(checkersState);
                        } else {
                          next_score = get_best_action(next_state, depth, max_depth, (turn + 1) % 2, agent, alpha_beta)[1];
                        }
                        if (i == 0) {
                            best_action = 0;
                            best_score = next_score;
                            if (best_score > alpha_beta[0]) {
                                alpha_beta = [best_score, alpha_beta[1]];
                            }
                        } else {
                            if (next_score > best_score) {
                                best_action = i;
                                best_score = next_score;
                                if (best_score > alpha_beta[0]) {
                                    alpha_beta = [best_score, alpha_beta[1]]
                                }
                            }
                        }
                    }
                }
                return [legal_actions[best_action], best_score];
            } else { //minimize!
                for (var i = 0; i < next_states.length; i++) {
                    var next_state = next_states[i];
                    if ((alpha_beta[1] - alpha_beta[0]) > 0) {
                        var next_score = get_best_action(next_state, depth + 1, max_depth, (turn + 1) % 2, agent, alpha_beta)[1];
                        if (i == 0) {
                            best_action = 0;
                            best_score = next_score;
                            if (best_score < alpha_beta[1]) {
                                alpha_beta = [alpha_beta[0], best_score];
                            }
                        } else {
                            if (next_score < best_score) {
                                best_action = i;
                                best_score = next_score;
                                if (best_score < alpha_beta[1]) {
                                    alpha_beta = [alpha_beta[0], best_score];
                                }
                            }
                        }
                    }
                }
                return [legal_actions[best_action], best_score];
            }
        }
    var alpha_beta = [0 - Infinity, Infinity];
    var best_action = get_best_action(checkersState, 0, this.depth, this.agent, this.agent, alpha_beta); //state, agent, max_depth = 4, depth, agent, alpha_beta
    return best_action[0];
    }
}


// Heuristics!!!!

// 00 01 02
// 10 11 12
// 20 21 22

function normalize(weights) {
    sum = 0
    for (var i = 0; i < weights.length; i++) {
        sum = sum + (weights[i] * weights[i])
    }
    sqrt = Math.sqrt(sum)
    for (var i = 0; i < weights.length; i++) {
        weights[i] = weights[i] / sqrt
        if (weights[i] > 10) {
            weights[i] = 10
        }
    }
    return features;
}

function isEndgame(state) {
    if (state.numRedPieces <= 5 || state.numBlackPieces <= 5) {
        return true;
    }
    return false;
}


function numberOfPawns(state, agent) { // #1, keep
    var numRedPawns= 0;
    var numBlackPawns = 0;
    for (var i = 0; i < state.WIDTH; i++) {
        for (var j = 0; j < state.HEIGHT; j++) {
            if (state.board[i][j] == 1) {
                numRedPawns++;
            } else if (state.board[i][j] == 3) {
                numBlackPawns++;
            }
        }
    }
    if (agent == 0) {
        return (numRedPawns - numBlackPawns);
    } else {
        return (numBlackPawns - numRedPawns);
    }
}

function numberOfKings(state, agent) { // #2, keep
    var numRedKings = 0;
    var numBlackKings = 0;
    for (var i = 0; i < state.WIDTH; i++) {
        for (var j = 0; j < state.HEIGHT; j++) {
            if (state.board[i][j] == 2) {
                numRedKings++;
            } else if (state.board[i][j] == 4) {
                numBlackKings++;
            }

        }
    }
    if (agent == 0) {
        return (numRedKings - numBlackKings);
    } else {
        return (numBlackKings - numRedKings);
    }
}

function numSafePawns(state, agent) { // #3, nah
    var numRedPawns = 0;
    var numBlackPawns = 0;
    for (var i = 0; i < state.WIDTH; i++) {
        for (var j = 0; j < state.HEIGHT; j++) {
            if (i == 0 || i == 7 || j == 0 || j == 7) {
                if (state.board[i][j] == 1) {
                    numRedPawns++;
                } else if (state.board[i][j] == 3) {
                    numBlackPawns++;
                }
            }
        }
    }
    if (agent == 0) {
        return (numRedPawns - numBlackPawns);
    } else {
        return (numBlackPawns - numRedPawns);
    }
}

function numSafeKings(state, agent) { // #4, nah
    var numRedKings = 0;
    var numBlackKings = 0;
    for (var i = 0; i < state.WIDTH; i++) {
        for (var j = 0; j < state.HEIGHT; j++) {
            if (i == 0 || i == 7 || j == 0 || j == 7) {
                if (state.board[i][j] == 2) {
                    numRedKings++;
                } else if (state.board[i][j] == 4) {
                    numBlackKings++;
                }
            }
        }
    }
    if (agent == 0) {
        return (numRedKings - numBlackKings);
    } else {
        return (numBlackKings - numRedKings);
    }
}


function numMovablePawns (state, agent) { // #5, nah
    var numRedPawns = 0;
    var numBlackPawns = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        for(var y = 0; y < state.HEIGHT; y ++) {
            if (state.board[y][x] == 1) {
                if (state.inBounds(y+1, x+1) && state.board[y+1][x+1]==0) {
                    numRedPawns++;
                }
                if (state.inBounds(y+1, x-1) && state.board[y+1][x-1]==0) {
                    numRedPawns++;
                }
            } else if (state.board[y][x] == 3) {
                if (state.inBounds(y-1, x+1) && state.board[y-1][x+1]==0) {
                    numBlackPawns++;
                }
                if (state.inBounds(y-1, x-1) && state.board[y-1][x-1]==0) {
                    numBlackPawns++;
                }
            }
        }
    }
    if (agent == 0) {
        return (numRedPawns - numBlackPawns);
    } else {
        return (numBlackPawns - numRedPawns);
    }
}

function numMovableKings (state, agent) { // #6, nah
    var numRedKings = 0;
    var numBlackKings = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        for(var y = 0; y < state.HEIGHT; y ++) {
            if (state.board[y][x] == 2) {
                if (state.inBounds(y+1, x+1) && state.board[y+1][x+1]==0) {
                    numRedKings++;
                }
                if (state.inBounds(y+1, x-1) && state.board[y+1][x-1]==0) {
                    numRedKings++;
                }
                if (state.inBounds(y-1, x+1) && state.board[y-1][x+1]==0) {
                    numRedKings++;
                }
                if (state.inBounds(y-1, x-1) && state.board[y-1][x-1]==0) {
                    numRedKings++;
                }
            } else if (state.board[y][x] == 4) {
                if (state.inBounds(y-1, x+1) && state.board[y-1][x+1]==0) {
                    numBlackKings++;
                }
                if (state.inBounds(y-1, x-1) && state.board[y-1][x-1]==0) {
                    numBlackKings++;
                }
                if (state.inBounds(y+1, x+1) && state.board[y+1][x+1]==0) {
                    numBlackKings++;
                }
                if (state.inBounds(y+1, x-1) && state.board[y+1][x-1]==0) {
                    numBlackKings++;
                }
            }
        }
    }
    if (agent == 0) {
        return (numRedKings - numBlackKings);
    } else {
        return (numBlackKings - numRedKings);
    }
}

function distanceToPromotion(state, agent) { // #7, keep
    var RedPawnDistance = 0;
    var BlackPawnDistance = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        for(var y = 0; y < state.HEIGHT; y ++) {
            if (state.board[y][x] == 1) {
                RedPawnDistance = RedPawnDistance + (state.HEIGHT - 1 - y);
            }
            if (state.board[y][x] == 3) {
                BlackPawnDistance = BlackPawnDistance + y;
            }
        }
    }
    if (agent == 0) {
        return (RedPawnDistance - BlackPawnDistance)
    } else {
        return (BlackPawnDistance - RedPawnDistance);
    }
}

function promotionAvailability(state, agent) { // #8, nah
    var RedAvailability = 0;
    var BlackAvailability = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        if (state.board[0][x] == 0) {
            BlackAvailability++;
        }
        if (state.board[state.HEIGHT - 1][x] == 0) {
            RedAvailability++;
        }
    }
    if (agent == 0) {
        return (RedAvailability - BlackAvailability);
    } else {
        return (BlackAvailability - RedAvailability);
    }

}

function numDefenders(state, agent) { // #9, keep
    var RedDefenders = 0;
    var BlackDefenders = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        for(var y = 0; y < state.HEIGHT; y++) {
            if (y == state.HEIGHT || y == (state.HEIGHT - 1)) {
                if (state.board[y][x] == 1 || state.board[y][x] == 2) {
                    BlackDefenders++;
                }
            }
            if (y == 0 || y == 1) {
                if (state.board[y][x] == 3 || state.board[y][x] == 4) {
                    RedDefenders++;
                }
            }
        }
    }
    if (agent == 0) {
        return (RedDefenders - BlackDefenders)
    } else {
        return (BlackDefenders - RedDefenders);
    }
}

function numAttackers(state, agent) { // #10, keep
    var RedAttackers = 0;
    var BlackAttackers = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        for(var y = 0; y < state.HEIGHT; y ++) {
            if (y == 0 || y == 1 || y == 2) {
                if (state.board[y][x] == 1 || state.board[y][x] == 2) {
                    BlackAttackers++;
                }
            }
            if (y == state.HEIGHT || y == (state.HEIGHT - 1) || y == (state.HEIGHT - 2)) {
                if (state.board[y][x] == 3 || state.board[y][x] == 4) {
                    RedAttackers++;
                }
            }
        }
    }
    if (agent == 0) {
        return (RedAttackers - BlackAttackers);
    } else {
        return (BlackAttackers - RedAttackers);
    }
}

function numCentralPawns(state, agent) { // #11, keep
    var RedCentralPawns = 0;
    var BlackCentralPawns = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        for(var y = 0; y < state.HEIGHT; y ++) {
            if (x >= 3 && x <= 6 && y >= 3 && y <= 6) {
                if (state.board[y][x] == 1) {
                    RedCentralPawns++;
                } else if (state.board[y][x] == 3) {
                    BlackCentralPawns++;
                }
            }
        }
    }
    if (agent == 0) {
        return (RedCentralPawns - BlackCentralPawns)
    } else {
        return (BlackCentralPawns - RedCentralPawns);
    }
}

function numCentralKings(state, agent) { // #12, keep
    var RedCentralKings = 0;
    var BlackCentralKings = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        for(var y = 0; y < state.HEIGHT; y ++) {
            if (x >= 3 && x <= 6 && y >= 3 && y <= 6) {
                if (state.board[y][x] == 2) {
                    RedCentralKings++;
                } else if (state.board[y][x] == 4) {
                    BlackCentralKings++;
                }
            }
        }
    }
    if (agent == 0) {
        return (RedCentralKings - BlackCentralKings)
    } else {
        return (BlackCentralKings - RedCentralKings);
    }

}
function numPawnsMainDiagonal(state, agent){ // #13, nah
    var RedPawnsMD = 0;
    var BlackPawnsMD = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        for(var y = 0; y < state.HEIGHT; y ++) {
            if (x + y == (state.WIDTH - 1)) {
                if (state.board[y][x] == 1) {
                    RedPawnsMD++;
                } else if (state.board[y][x] == 3) {
                    BlackPawnsMD++;
                }
            }
        }
    }
    if (agent == 0) {
        return (RedPawnsMD - BlackPawnsMD);
    } else {
        return (BlackPawnsMD - RedPawnsMD);
    }
}

function numKingsMainDiagonal(state, agent){ // #14, nah
    var RedKingsMD = 0;
    var BlackKingsMD = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        for(var y = 0; y < state.HEIGHT; y ++) {
            if (x + y == (state.WIDTH - 1)) {
                if (state.board[y][x] == 2) {
                    RedKingsMD++;
                } else if (state.board[y][x] == 4) {
                    BlackKingsMD++;
                }
            }
        }
    }
    if (agent == 0) {
        return (RedKingsMD - BlackKingsMD)
    } else {
        return (BlackKingsMD - RedKingsMD);
    }
}

function numPawnsDoubleDiagonal(state, agent){ // #15, nah
    var RedPawnsDD = 0;
    var BlackPawnsDD = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        for(var y = 0; y < state.HEIGHT; y ++) {
            if ((x - y) == 1 || (y - x) == 1) {
                if (state.board[y][x] == 1) {
                    RedPawnsDD++;
                } else if (state.board[y][x] == 3) {
                    BlackPawnsDD++;
                }
            }
        }
    }
    if (agent == 0) {
        return (RedPawnsDD - BlackPawnsDD)
    } else {
        return (BlackPawnsDD - RedPawnsDD);
    }
}

function numKingsDoubleDiagonal(state, agent){ // #16, nah
    var RedKingsDD = 0;
    var BlackKingsDD = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        for(var y = 0; y < state.HEIGHT; y ++) {
            if ((x - y) == 1 || (y - x) == 1) {
                if (state.board[y][x] == 2) {
                    RedKingsDD++;
                } else if (state.board[y][x] == 4) {
                    BlackKingsDD++;
                }
            }
        }
    }
    if (agent == 0) {
        return (RedKingsDD - BlackKingsDD)
    } else {
        return (BlackKingsDD - RedKingsDD);
    }
}

function numLonerPawns (state, agent) {// #17, nah
    var RedLonerPawns = 0;
    var BlackLonerPawns = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        for (var y = 0; y < state.HEIGHT; y ++) {
            if (state.board[y][x] == 1) {
                var redLonerCounter = 0
                if (state.inBounds(y+1, x+1) && state.board[y+1][x+1]==0) {
                    redLonerCounter++;
                }
                if (state.inBounds(y+1, x-1) && state.board[y+1][x-1]==0) {
                    redLonerCounter++;
                }
                if (state.inBounds(y-1, x+1) && state.board[y-1][x+1]==0) {
                    redLonerCounter++;
                }
                if (state.inBounds(y-1, x-1) && state.board[y-1][x-1]==0) {
                    redLonerCounter++;
                }
                if (redLonerCounter == 4) {
                    RedLonerPawns++;
                }
            } else if (state.board[y][x] == 3) {
                var blackLonerCounter = 0
                if (state.inBounds(y-1, x+1) && state.board[y-1][x+1]==0) {
                    blackLonerCounter++;
                }
                if (state.inBounds(y-1, x-1) && state.board[y-1][x-1]==0) {
                    blackLonerCounter++;
                }
                if (state.inBounds(y+1, x+1) && state.board[y+1][x+1]==0) {
                    blackLonerCounter++;
                }
                if (state.inBounds(y+1, x-1) && state.board[y+1][x-1]==0) {
                    blackLonerCounter++;
                }
                if (blackLonerCounter == 4) {
                    BlackLonerPawns++;
                }
            }
        }
    }
    if (agent == 0) {
        return (RedLonerPawns - BlackLonerPawns);
    } else {
        return (BlackLonerPawns - RedLonerPawns);
    }
}

function numLonerKings (state, agent) { // #18, nah
    var RedLonerKings = 0;
    var BlackLonerKings = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        for (var y = 0; y < state.HEIGHT; y ++) {
            if (state.board[y][x] == 2) {
                var redLonerCounter = 0
                if (state.inBounds(y+1, x+1) && state.board[y+1][x+1]==0) {
                    redLonerCounter++;
                }
                if (state.inBounds(y+1, x-1) && state.board[y+1][x-1]==0) {
                    redLonerCounter++;
                }
                if (state.inBounds(y-1, x+1) && state.board[y-1][x+1]==0) {
                    redLonerCounter++;
                }
                if (state.inBounds(y-1, x-1) && state.board[y-1][x-1]==0) {
                    redLonerCounter++;
                }
                if (redLonerCounter == 4) {
                    RedLonerKings++;
                }
            } else if (state.board[y][x] == 4) {
                var blackLonerCounter = 0
                if (state.inBounds(y-1, x+1) && state.board[y-1][x+1]==0) {
                    blackLonerCounter++;
                }
                if (state.inBounds(y-1, x-1) && state.board[y-1][x-1]==0) {
                    blackLonerCounter++;
                }
                if (state.inBounds(y+1, x+1) && state.board[y+1][x+1]==0) {
                    blackLonerCounter++;
                }
                if (state.inBounds(y+1, x-1) && state.board[y+1][x-1]==0) {
                    blackLonerCounter++;
                }
                if (blackLonerCounter == 4) {
                    BlackLonerKings++;
                }
            }
        }
    }
    if (agent == 0) {
        return (RedLonerKings - BlackLonerKings)
    } else {
        return (BlackLonerKings - RedLonerKings);
    }
}


function numHoles(state, agent) { // #19, keep
    RedHoles = 0;
    BlackHoles = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        for(var y = 0; y < state.HEIGHT; y ++) {
            if (state.board[y][x] == 0) {
                var numRedNeighbors = 0;
                var numBlackNeighbors = 0;
                if (state.inBounds(y+1, x+1) && (state.board[y+1][x+1] ==1 || state.board[y+1][x+1] == 2)) {
                    numRedNeighbors++;
                } else if (state.inBounds(y+1, x+1) && (state.board[y+1][x+1]== 3 || state.board[y+1][x+1]== 4)) {
                    numBlackNeighbors++;
                }
                if (state.inBounds(y+1, x-1) && (state.board[y+1][x-1]==1 || state.board[y+1][x-1]== 2)) {
                    numRedNeighbors++;
                } else if (state.inBounds(y+1, x-1) && (state.board[y+1][x-1]== 3 || state.board[y+1][x-1]== 4)) {
                    numBlackNeighbors++;
                }
                if (state.inBounds(y-1, x+1) && (state.board[y-1][x+1]==1 || state.board[y-1][x+1]== 2)) {
                    numRedNeighbors++;
                } else if (state.inBounds(y-1, x+1) && (state.board[y-1][x+1]== 3 || state.board[y-1][x+1]== 4)) {
                    numBlackNeighbors++;
                }
                if (state.inBounds(y-1, x-1) && (state.board[y-1][x-1]==1 || state.board[y-1][x-1]== 2)) {
                    numRedNeighbors++;
                } else if (state.inBounds(y-1, x-1) && (state.board[y-1][x-1]== 3 || state.board[y-1][x-1]== 4)) {
                    numBlackNeighbors++;
                }
                if (numRedNeighbors >= 3) {
                    RedHoles += 1;
                } else if (numBlackNeighbors >= 3) {
                    BlackHoles += 1;
                }
            }
        }
    }
    if (agent == 0) {
        return (RedHoles - BlackHoles);
    } else {
        return (BlackHoles - RedHoles);
    }
}

class qMinimaxAgent {
    constructor(evalFunc, depth, agent) {
        this.depth = depth;
        this.evalFunc = evalFunc;
        this.agent = agent
    }

    getAction(checkersState) {
        var self = this;
        var get_best_action = function (checkersState, depth, max_depth, turn, agent, alpha_beta) { //eval function in state
            if (checkersState.isWin(turn) == true || checkersState.isLose(turn) == true) {
                var score = null;
                if (turn == 0) {
                    score = checkersState.getScore();
                } else {
                    score = 0 - checkersState.getScore();
                }
                return [null, score];
            }
            var legal_actions = checkersState.getLegalActions(turn);
            shuffle(legal_actions);
            var next_states = [];
            for (var i in legal_actions) {
              next_states.push(checkersState.generateSuccessor(legal_actions[i], turn));
            }
            var best_action = null;
            var best_score = null;

            if (turn == agent) { // maximize!
                for (var i = 0; i < next_states.length; i++) {
                    var next_state = next_states[i];
                    if ((alpha_beta[1] - alpha_beta[0]) > 0) {
                        var next_score = null
                        if (depth >= max_depth) {
                            next_score = self.evalFunc(checkersState);
                        } else {
                            if (next_states.length <= 2) {
                                next_score = get_best_action(next_state, depth + 0.3, max_depth, (turn + 1) % 2, agent, alpha_beta)[1];
                            } else {
                                next_score = get_best_action(next_state, depth + 0.6, max_depth, (turn + 1) % 2, agent, alpha_beta)[1];
                            }
                        }
                        if (i == 0) {
                            best_action = 0;
                            best_score = next_score;
                            if (best_score > alpha_beta[0]) {
                                alpha_beta = [best_score, alpha_beta[1]];
                            }
                        } else {
                            if (next_score > best_score) {
                                best_action = i;
                                best_score = next_score;
                                if (best_score > alpha_beta[0]) {
                                    alpha_beta = [best_score, alpha_beta[1]]
                                }
                            }
                        }
                    }
                }
                return [legal_actions[best_action], best_score];
            } else { //minimize!
                for (var i = 0; i < next_states.length; i++) {
                    var next_state = next_states[i];
                    if ((alpha_beta[1] - alpha_beta[0]) > 0) {
                        var next_score = null
                        if (next_states.length <= 2) {
                            next_score = get_best_action(next_state, depth + 0.3, max_depth, (turn + 1) % 2, agent, alpha_beta)[1];
                        } else {
                            next_score = get_best_action(next_state, depth + 0.6, max_depth, (turn + 1) % 2, agent, alpha_beta)[1];
                        }
                        if (i == 0) {
                            best_action = 0;
                            best_score = next_score;
                            if (best_score < alpha_beta[1]) {
                                alpha_beta = [alpha_beta[0], best_score];
                            }
                        } else {
                            if (next_score < best_score) {
                                best_action = i;
                                best_score = next_score;
                                if (best_score < alpha_beta[1]) {
                                    alpha_beta = [alpha_beta[0], best_score];
                                }
                            }
                        }
                    }
                }
                return [legal_actions[best_action], best_score];
            }
        }
    var alpha_beta = [0 - Infinity, Infinity];
    var best_action = get_best_action(checkersState, 0, this.depth, this.agent, this.agent, alpha_beta); //state, agent, max_depth = 4, depth, agent, alpha_beta
    return best_action[0];
    }
}

class EightFactorEndMinimaxAgent {
  constructor(weights, agent, depth) {
    var evalFunc = function(game) {
      var score = 0;
      var fastFactors = new FastFactors(game);
      var factors = fastFactors.eightFactorArrayEnd(agent);
      for (var i in factors) {
        score += factors[i] * weights[i];
      }
      return score;
    }
    this.minimax = new minimaxAgent(evalFunc, depth, agent);
  }

  getAction(game) {
    return this.minimax.getAction(game);
  }
}

class RandomAgent {
  constructor(agent) {
    this.agent = agent;
  }
  getAction(game) {
    var actions = game.getLegalActions(this.agent);
    var numActions = actions.length;
    var index = Math.floor(Math.random() * numActions)
    return actions[index];
  }
}

class NaiveMinimaxAgent {
  constructor(agent) {
    var evalFunc = function(game) {
        if (agent == 0) {
            score = checkersState.getScore();
        } else {
            score = 0 - checkersState.getScore();
        }
        return score;
    }
    this.minimax = new minimaxAgent(evalFunc, 4, agent);
  }

  getAction(game) {
    return this.minimax.getAction(game);
  }
}



class HandpickedMinimaxAgent {
  constructor(agent) {
    var evalFunc = function(game) {
      var score = 0;
      score += numberOfPawns(game, agent) * 10;
      score += numberOfKings(game, agent) * 15;
      score += numSafePawns(game, agent) * 1;
      score += numSafeKings(game, agent) * 1.5;
      score += numCentralPawns(game, agent) * 2;
      score += numCentralKings(game, agent) * 1;
      return score;
    }
    this.minimax = new minimaxAgent(evalFunc, 4, agent);
  }

  getAction(game) {
    return this.minimax.getAction(game);
  }
}
class LargeWeightedMinimaxAgent {
  constructor(weights, agent, depth) {
    var evalFunc = function(game) {
      var score = 0;
      score += numberOfPawns(game, agent) * weights[0];
      score += numberOfKings(game, agent) * weights[1];
      score += numSafePawns(game, agent) * weights[2];
      score += numSafeKings(game, agent) * weights[3];
      score += numMovablePawns(game, agent) * weights[4];
      score += numMovableKings(game, agent) * weights[5];
      score += distanceToPromotion(game, agent) * weights[6];
      score += promotionAvailability(game, agent) * weights[7];
      score += numDefenders(game, agent) * weights[8];
      score += numAttackers(game, agent) * weights[9];
      score += numCentralPawns(game, agent) * weights[10];
      score += numCentralKings(game, agent) * weights[11];
      score += numPawnsMainDiagonal(game, agent) * weights[12];
      score += numKingsMainDiagonal(game, agent) * weights[13];
      score += numPawnsDoubleDiagonal(game, agent) * weights[14];
      score += numKingsDoubleDiagonal(game, agent) * weights[15];
      score += numHoles(game, agent) * weights[16];
      score += numLonerPawns(game, agent) * weights[17];
      score += numLonerKings(game, agent) * weights[18];
      return score;
    }
    this.minimax = new minimaxAgent(evalFunc, depth, agent);
  }

  getAction(game) {
    return this.minimax.getAction(game);
  }
}

class FullFactorEvolutionaryAgent {
  constructor(agent) {
    var weights = [ -1.1855748431814277,
      6.011485729987687,
      2.259326207557641,
      -2.455042762058169,
      -2.068486020254222,
      -1.6222482380228076,
      6.861000389144015,
      1.1189259951391186,
      1.5322928000196767,
      3.474125144838812,
      5.84500882271625,
      -8.084932643824263,
      0.5135199479773944,
      -3.21453918973781,
      -2.039357427463695,
      -4.304786169022722,
      -1.7794835733612788,
      -5.916041119156512,
      -2.875900864145535 ];
    this.agent = new LargeWeightedMinimaxAgent(weights, agent, 4)
  }

  getAction(game) {
    return this.agent.getAction(game);
  }
}

class EightFactorMinimaxAgent {
  constructor(weights, agent, depth) {
    var evalFunc = function(game) {
      var score = 0;
      var fastFactors = new FastFactors(game);
      var factors = fastFactors.eightFactorArray(agent);
      for (var i in factors) {
        score += factors[i] * weights[i];
      }
      return score;
    }
    this.minimax = new minimaxAgent(evalFunc, depth, agent);
  }

  getAction(game) {
    return this.minimax.getAction(game);
  }
}


class EightFactorEvolutionaryAgent {
  constructor(agent) {
    var weights = [38.772531211684345,
      42.141152922416275,
      10.945364518815374,
      -2.8981366526683674,
      -13.680551933762793,
      -5.522701844285107,
      10.925037969673637,
      0.6380088696436439];
    this.agent = new EightFactorMinimaxAgent(weights, agent, 4)
  }

  getAction(game) {
    return this.agent.getAction(game);
  }
}

class EightFactorEndEvolutionaryAgent {
  constructor(agent) {
    var weights = [26.3588882149776,62.05169804007839,
      7.823861336714351,
      7.877946970595879,
      0.8043990603097557,
      -6.285835915862558,
      -7.004397236139457,
      4.3283898351096495,
      1.4791722087807897,
      -3.1977215422581704,
      -2.3113625371927182,
      -5.224852895753143,
      0.5808764183966684,
      2.8696641987523694];
    this.agent = new EightFactorEndMinimaxAgent(weights, agent, 4)
  }

  getAction(game) {
    return this.agent.getAction(game);
  }
}

class HandpickedEndQuiesceAgent {
  constructor(agent) {
    var weights = [10, 15, 1, 1.5, 0,0,2,1,.5,.5,-1,-.5,.5,1];
    var evalFunc = function(game) {
      var score = 0;
      var fastFactors = new FastFactors(game);
      var factors = fastFactors.eightFactorArray(agent);
      for (var i in factors) {
        score += factors[i] * weights[i];
      }
      return score;
    }
    this.minimax = new qMinimaxAgent(evalFunc, 4, agent);
  }

  getAction(game) {
    return this.minimax.getAction(game);
  }
}

class HandpickedEndAgent {
  constructor(agent) {
    var weights = [10, 15,1, 1.5, 0,0,2,1,.5,.5,-1,-.5,.5,1];
    this.agent = new EightFactorEndMinimaxAgent(weights, agent, 4)
  }

  getAction(game) {
    return this.agent.getAction(game);
  }
}

class TDLearningAgent {
  constructor(agent) {
    var weights = [ 13.026120839472771,
  20.277174872746865,
  3.323674717605918,
  -0.24416204289543067,
  0.26119633550302845,
  0.19987813505777408,
  -2.8503888246229905,
  -0.06559679802024988 ];
    this.agent = new EightFactorMinimaxAgent(weights, agent, 4)
  }

  getAction(game) {
    return this.agent.getAction(game);
  }
}






function equal(arr1, arr2) {
    if (arr1.length != arr2.length) return false;
    for (var i=0; i<arr1.length-1; i++) {
        if(arr1[i][0]!=arr2[i][0]) return false;
        if(arr1[i][1]!=arr2[i][1]) return false;
    }
    return true;
}

function rrandom() {
  var u = 1 - Math.random();
  var v = 1 - Math.random();
  return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

var fs = require('fs');
var file = "transcripttest.json"
var obj = JSON.parse(fs.readFileSync(file, 'utf8'));


var successes = 0
var total = obj.length
var state = new checkersGame()
var tester = new NaiveMinimaxAgent(0);
 //var naiveMinimax = new NaiveMinimaxAgent()
//
// var weights = [4.270656236945501, 8.272722078071844, 4.824915178976637, 7.292838574253646, 4.079703915111446, 7.372571268013061, -8.679599941672302];
// var weightedMinimax = new SmallWeightedMinimaxAgent(weights, 0, 4);
// var handpickedMinimax = new HandpickedMinimaxAgent(0);
 //var randomAgent = new RandomAgent(0);
// var turtles = new EightFactorEndMinimaxAgent([100, 150,   2, 1, 0, 2, 3, 4,   -2, -2, -1,-2, -2, 5],0,4)
// // var turtles4 = new EightFactorEndMinimaxAgent([10, 15,   1, 1.5, 0,0,2,1,   0,0, 0,0,0,1],0,4)//best
// var turtles3 = new EightFactorEndMinimaxAgent([10, 15,   1, 1.5, 0,0,2,1,   0,-1, 0,0,0,1],0,4)
// var lazy = new EightFactorEndMinimaxAgent([20, 30, 1, 1, 3,2,2, 1, 2, -1, -1, 1, 2, 5], 0,4)
//
// // var turtles4 = new EightFactorEndMinimaxAgent([10, 15,   1, 1.5, 0,0,2,1,   0,0,-.5,0,0,1],0,4)
// var turtles4 = new EightFactorEndMinimaxAgent([10, 15,   1, 1.5, 0,0,2,1,   .5,.5,-1,-.5,.5,1],0,4)




var numCorrectMoves = 0;
var numTotalMoves = 0;
var counter = 0;

for (var i in obj) {
	state.board = obj[i].board;
	var redPieces = 0;
	var blackPieces = 0;
	for (var x = 0; x < state.WIDTH; x++) {
        for (var y = 0; y < state.HEIGHT; y ++) {
            if (state.board[y][x] == 1 || state.board[y][x] == 2) {
            	redPieces++;
            } else if (state.board[y][x] == 3 || state.board[y][x] == 4) {
				blackPieces++;
			}
		}
	}
	state.numRedPieces = redPieces;
	state.numBlackPieces = blackPieces;
    if(state.getLegalActions(0).length==1) continue;
  // console.log("get action")
	minimaxAction = tester.getAction(state)
    //console.log(minimaxAction)
  // console.log("done")
	action = obj[i].move;

    //console.log(action);
    //console.log(minimaxAction);

    if(equal(action, minimaxAction)) {
        numCorrectMoves ++;
    }
    numTotalMoves++;
    //
    // if(counter%10 == 0) {
    //    console.log(counter);
    //    console.log(numCorrectMoves / numTotalMoves);
    // }
    counter++;
}
console.log(numCorrectMoves);
console.log(numTotalMoves);
console.log(numCorrectMoves / numTotalMoves);
