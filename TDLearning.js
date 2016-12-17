//Scroll to the bottom to see the relevant code. Javascript does not let you import
//files so we had to copy in a lot of code

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

    generateSuccessor(action, agent) {
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
            state.board[lastMove[1]][lastMove[0]] = state.board[firstMove[1]][firstMove[0]];
            if(agent == 0 && lastMove[1] == 7) {
                state.board[lastMove[1]][lastMove[0]]=2;
            } else if(agent == 1 && lastMove[1] == 0) {
                state.board[lastMove[1]][lastMove[0]]=4;
            }
            state.board[firstMove[1]][firstMove[0]] = 0;
        } else {
            var containsUpgrade = false;
            for (var i = 0; i < action.length - 2; i ++) {
                var first = action[i];
                var second = action[i+1];
                // console.log('x:', (first[1] + second[1]) / 2, ' y:', (first[0] + second[0]) / 2);
                state.board[(first[1] + second[1]) / 2][(first[0] + second[0]) / 2] = 0;
                if (agent == 0 && second[1] == 7) {
                    containsUpgrade = true;
                } else if (agent == 1 && second[1] == 0) {
                    containsUpgrade = true;
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
            if (y+2 == 7) {
                //console.log('upgrade?');
                piece = 2;
            }
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
            if (y-2 == 0) {
                //console.log('upgrade?')
                piece = 4
            }
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






class TDLearning {
    constructor(g, s) {
        this.gamma = g;
        this.stepSize = s;

        this.rand = this.rand.bind(this);
        this.learn = this.learn.bind(this);
        this.objectiveFunction = this.objectiveFunction.bind(this);
        this.train = this.train.bind(this);
        this.V = this.V.bind(this);
    }

    rand() {
        var u = 1 - Math.random();
        var v = 1 - Math.random();
        return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    }

    V(state, weights, agent) {
        var features = new FastFactors(state);
        var featureVec = features.eightFactorArray(agent);
        var value = 0;
        for(var i=0; i < weights.length; i++) {
            value += featureVec[i] * weights[i];
        }
        return value;
    }

    learn(w0, w1) {
        /*
        for(var i = 0; i < w0.length; i+=1) {
            w0[i] = w0[i] + random();
        }
        for(var i = 0; i < w1.length; i+=1) {
            w1[i] = w1[i] + random();
        }*/


        var game = new checkersGame();
        for (var round = 0; round < 100; round++) {
            console.log(w0);
            var p0 = new EightFactorMinimaxAgent(w0, 0, 2);
            var currAction = p0.getAction(game);/*
            var action = game.getLegalActions(0);
            var currAction = action[0]
            for(var a=1; a < action.length; a++) {
                if (this.V(game.generateSuccessor(currAction, 0) , w0, 0) + game.generateSuccessor(currAction, 0).getScore()< this.V(game.generateSuccessor(action[a], 0), w0, 0) + game.generateSuccessor(action[a], 0).getScore()) {
                    currAction = action[a];
                }
            }*/
            var succGame = game.generateSuccessor(currAction, 0);
            if (succGame.isWin(0) || succGame.isLose(0)) {
              var reward = 0;
              reward = game.isWin(0) ? 20 : -20;
              w0 = this.train(game, reward, succGame, w0, 0);
              return w0;
            }
            w0 = this.train(game, succGame.getScore() - game.getScore(), succGame, w0, 0);
            game = succGame;
            var action = game.getLegalActions(1);
            var currAction = action[0]
            for(var a=1; a < action.length; a++) {
                if (this.V(game.generateSuccessor(currAction, 1), w0, 1) - game.generateSuccessor(currAction, 1).getScore()< this.V(game.generateSuccessor(action[a], 1), w0, 1) - game.generateSuccessor(action[a], 1).getScore()) {
                    currAction = action[a];
                }
            }

            var p0 = new EightFactorMinimaxAgent(w0, 1, 2);
            var currAction = p0.getAction(game);
            var succGame = game.generateSuccessor(currAction, 1);
            if (succGame.isWin(1) || succGame.isLose(1)) {
              var reward = 0;
              reward =  game.isWin(1) ? 20 : -20;
              w0 = this.train(game, reward, succGame, w0, 1);
              return w0;
            }
            w0 = this.train(game, succGame.getScore() - game.getScore(), succGame, w0, 1);
            game = succGame
        }

        return w0;
    }

    objectiveFunction(oldState, reward, newState, weights, agent) {
        return this.V(oldState, weights, agent) - (reward + this.gamma * this.V(newState, weights, agent));
    }

    train(oldState, reward, newState, weights, agent) {
        var gradient = this.stepSize * this.objectiveFunction(oldState, reward, newState, weights, agent);
        var features = new FastFactors(oldState);
        var featureVec = features.eightFactorArray(agent);
        var value = 0;
        //console.log(gradient);
        //console.log('Features:')
        //console.log(featureVec)
        for(var i=0; i < weights.length; i++) {
            weights[i] = weights[i] - gradient * featureVec[i];
            //console.log(weights[i])
        }
        return weights;
    }

}

var tdLearning = new TDLearning(1, 0.01);
w0 = [0,0,0,0,0,0,0,0];
for(var i=0; i< w0.length; i++) {
    w0[i] = w0[i] + tdLearning.rand();
}

for(var i=0; i < 1000; i++) {
    w0 = tdLearning.learn(w0, w1);
    console.log(w0);
}

/*
[ 13.026120839472771,
  20.277174872746865,
  3.323674717605918,
  -0.24416204289543067,
  0.26119633550302845,
  0.19987813505777408,
  -2.8503888246229905,
  -0.06559679802024988 ]


*/















