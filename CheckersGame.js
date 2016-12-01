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
        this.numRedPieces = 8;
        this.numBlackPieces = 8;
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
            if (this.numBlackPieces == 0) {
                return true;
            }
        } else if (agent == 1) {
            if(this.numRedPieces == 0) {
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
        console.log(inputArray);
        for (var i = 0; i < inputArray.length; i++) {
            console.log(inputArray[i]);
            for (var j = 0; j < inputArray[i].length; j++) {
              console.log(i + " " + j);
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
                    state.board[lastMove[0]][lastMove[1]] = 2;
                }
            } else {
                state.numRedPieces = state.numRedPieces - action.length + 2;
                if (containsUpgrade) {
                    state.board[lastMove[0]][lastMove[1]] = 4;
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
                console.log('upgrade?');
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
                this.board[y+1][x-1] = 0;
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
                console.log('upgrade?')
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
    constructor() {
        this.depth = 4;
    }

    getAction(checkersState) {
        var get_best_action = function (checkersState, depth, max_depth, agent, alpha_beta) { //eval function in state
            if (checkersState.isWin(agent) == true || checkersState.isLose(agent) == true) {
                return [null, checkersState.getScore()];
            }
            var legal_actions = checkersState.getLegalActions(agent);
            shuffle(legal_actions);
            var next_states = [];
            for (action in legal_actions) {
                next_states.push(checkersState.generateSuccessor(action, agent));
            }
            var best_action = null;
            var best_score = null;

            if (agent == 0) { // player
                for (var i = 0; i < next_states.length; i++) {
                    var next_state = next_states[i];
                    if ((alpha_beta[1] - alpha_beta[0]) > 0) {
                        var next_score = null;
                        if (depth == max_depth) {
                            next_score = checkersState.getScore()
                        } else {
                            next_score = get_best_action(next_state, depth, max_depth, 1, alpha_beta)[1];
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
            } else { //computer
                for (var i = 0; i < next_states.length; i++) {
                    var next_state = next_states[i];
                    if ((alpha_beta[1] - alpha_beta[0]) > 0) {
                        var next_score = get_best_action(next_state, depth + 1, max_depth, 0, alpha_beta)[1];
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
    var best_action = get_best_action(checkersState, 0, self.depth, 0, alpha_beta); //state, agent, max_depth = 4, depth, agent, alpha_beta
    return best_action[0];
    }
}

// Heuristics!!!!


function numberOfPawns(state) {
    var numRedPawns= 0;
    var numBlackPawns = 0;
    for (i = 0; i < state.WIDTH; i++) {
        for (j = 0; j < state,WIDTH; j++) {
            if (state.board[i][j] == 1) {
                numRedKings++;
            } else if (state.board[i][j] == 3) {
                numBlackKings++;
            }

        }
    }
    return (numRedPawns - numBlackPawns);
}
function numberOfKings(state) {
    var numRedKings = 0;
    var numBlackKings = 0;
    for (i = 0; i < state.WIDTH; i++) {
        for (j = 0; j < state,WIDTH; j++) {
            if (state.board[i][j] == 2) {
                numRedKings++;
            } else if (state.board[i][j] == 4) {
                numBlackKings++;
            }

        }
    }
    return (numRedKings - numBlackKings);
}

function numSafePawns(state) {
    var numRedPawns = 0;
    var numBlackPawns = 0;
    for (i = 0; i < state.WIDTH; i++) {
        for (j = 0; j < state,WIDTH; j++) {
            if (i == 0 || i == 7 || j == 0 || j == 7) {
                if (state.board[i][j] == 1) {
                    numRedPawns++;
                } else if (state.board[i][j] == 3) {
                    numBlackPawns++;
                }
            }
        }
    }
    return (numRedPawns - numBlackPawns);
}

function numSafeKings(state) {
    var numRedKings = 0;
    var numBlackKings = 0;
    for (i = 0; i < state.WIDTH; i++) {
        for (j = 0; j < state,WIDTH; j++) {
            if (i == 0 || i == 7 || j == 0 || j == 7) {
                if (state.board[i][j] == 2) {
                    numRedKings++;
                } else if (state.board[i][j] == 4) {
                    numBlackKings++;
                }
            }
        }
    }
    return (numRedKings - numBlackKings);
}


function numMovablePawns (state) {
    var numRedPawns = 0;
    var numBlackPawns = 0;
    for (var x = 0; x < this.WIDTH; x++) {
        for(var y = 0; y < this.HEIGHT; y ++) {
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
    return (numRedPawns - numBlackPawns);
}

function numMovableKings (state) {
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
            } else if (state.board[y][x] == 3) {
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
    return (numRedKings - numBlackKings);
}



function distanceToPromotion(state) {
    var RedPawnDistance = 0;
    var BlackPawnDistance = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        for(var y = 0; y < state.HEIGHT; y ++) {
            if (state.board[y][x] == 1) {
                RedPawnDistance = RedPawnDistance + (this.HEIGHT - 1 - y);
            if (state.board[y][x] == 3) {
                BlackPawnDistance = BlackPawnDistance + y
            }
        }
    }
    return (RedPawnDistance - BlackPawnDistance)
}

function promotionAvailability(state) {
    RedAvailability = 0;
    BlackAvailability = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        if (state.board[0][x] == 0) {
            BlackAvailability++;
        }
        if (state.board[state.HEIGHT - 1][x] == 0) {
            RedAvailability++;
        }
    }
    return (RedAvailability - BlackAvailability);
}

function numDefenders(state) {
    RedDefenders = 0;
    BlackDefenders = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        for(var y = 0; y < state.HEIGHT; y ++) {
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
    return (RedDefenders - BlackDefenders)
}

function numAttackers(state) {
    RedAttackers = 0;
    BlackAttackers = 0;
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
    return (RedAttackers - BlackAttackers)
}

function numCentralPawns(state) { //3,4,5,6
    RedCentralPawns = 0;
    BlackCentralPawns = 0;
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
    return (RedCentralPawns - BlackCentralPawns)
}

function numCentralKingss(state) { //3,4,5,6
    RedCentralPawns = 0;
    BlackCentralPawns = 0;
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
    return (RedCentralKings - BlackCentralKings)
}
function numPawnsMainDiagonal(state){
    RedPawnsMD = 0;
    BlackPawnsMD = 0;
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
    return (RedPawnsMD - BlackPawnsMD)
}

function numKingsMainDiagonal(state){
    RedKingsMD = 0;
    BlackKingsMD = 0;
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
    return (RedKingsMD - BlackKingsMD)
}

function numPawnsDoubleDiagonal(state){
    RedPawnsDD = 0;
    BlackPawnsDD = 0;
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
    return (RedPawnsMD - BlackPawnsMD)
}

function numKingsDoubleDiagonal(state){
    RedKingsDD = 0;
    BlackKingsDD = 0;
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
    return (RedKingsMD - BlackKingsMD)
}

function numHoles(state) {
    RedHoles = 0;
    BlackHoles = 0;
    for (var x = 0; x < state.WIDTH; x++) {
        for(var y = 0; y < state.HEIGHT; y ++) {
            if (state.board[y][x] == 0) {
                numRedNeighbors = 0;
                numBlackNeighbors = 0;
                if (state.inBounds(y+1, x+1) && (state.board[y+1][x+1]==1 || state.board[y+1][x+1]== 2) {
                    numRedNeighbors++;
                } else if (state.inBounds(y+1, x+1) && (state.board[y+1][x+1]== 3 || state.board[y+1][x+1]== 4) {
                    numBlackNeighbors++;
                }
                if (state.inBounds(y+1, x-1) && (state.board[y+1][x-1]==1 || state.board[y+1][x-1]== 2) {
                    numRedNeighbors++;
                } else if (state.inBounds(y+1, x-1) && (state.board[y+1][x-1]== 3 || state.board[y+1][x-1]== 4) {
                    numBlackNeighbors++;
                }
                if (state.inBounds(y-1, x+1) && (state.board[y-1][x+1]==1 || state.board[y-1][x+1]== 2) {
                    numRedNeighbors++;
                } else if (state.inBounds(y-1, x+1) && (state.board[y-1][x+1]== 3 || state.board[y-1][x+1]== 4) {
                    numBlackNeighbors++;
                }
                if (state.inBounds(y-1, x-1) && (state.board[y-1][x-1]==1 || state.board[y-1][x-1]== 2) {
                    numRedNeighbors++;
                } else if (state.inBounds(y-1, x-1) && (state.board[y-1][x-1]== 3 || state.board[y-1][x-1]== 4) {
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
    return (RedHoles - BlackHoles);
}

}
// 00 01 02
// 10 11 12
// 20 21 22



minimaxAgent = new minimaxAgent();

//game = new checkersGame();

/*
game.board[3][2] = 3
game.board[6][1] = 2
game.board[6][5] = 0
game.board[5][2] = 1
game.board[7][4] = 0
game.board[6][5] = 3
game.board[5][6] = 0
*/
<<<<<<< HEAD
tester = "00000000~\
10000000~\
00000000~\
00010000~\
00000000~\
00010000~\
00003000~\
00000000";
game.setBoard(tester);
console.log(game.board);
=======

>>>>>>> 87a5f4b3521180a5fe601d62c47b5ce0b8dcaee3
/*
console.log(game.board)
actions = game.getLegalActions(1);
console.log(actions);
newGame = game.generateSuccessor(actions[6], 1);
console.log(newGame.getLegalActions(1));
console.log(newGame.board);
*/
