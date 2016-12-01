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
        this.isWin = this.isWin.bind(this);
        this.isLose = this.isLose.bind(this);
        this.getScore = this.getScore.bind(this);
        this.generateSuccessor() = this.generateSuccessor.bind();
        this.getLegalActions() = this.getLegalActions.bind();
        this.inBounds() = this.inBounds.bind();
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
            if (this.numRedPieces == 0) {
                return true;
            }
        } else if (agent == 1) {
            if(this.numBlackPieces == 0) {
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
            return 1000;
        } else if(this.isWin(1)) {
            return -1000;
        } else {
            return this.numRedPieces - this.numBlackPieces;
        }
    }

    // action = [[(0,0), ... , (4,4)], 1]
    // If the second element of the array is 1, then the action involves eating pieces
    // If not, then the action does not involve eating pieces. 
    generateSuccessor(action, agent) {
        var state = new checkersGame();
        state.numRedPieces = this.numRedPieces;
        state.numBlackPieces = this.numBlackPieces;
        state.board = this.board;

        var moves = action[0];
        var firstMove = moves[0];
        var lastMove = moves[moves.length - 1];

        if(action[1] == 0) {
            state.board[lastMove[0]][lastMove[1]] = state.board[firstMove[0]][firstMove[1]];
            state.board[firstMove[0]][firstMove[1]] = 0;
        } else {
            for (var i = 0; i < moves.length -1; i ++) {
                var first = moves[i]
                var second = moves[i+1]
                state.board[(first[0]+second[0])/2][(first[1]+second[1])/2] = 0
            }
            state.board[lastMove[0]][lastMove[1]] = state.board[firstMove[0]][firstMove[1]];
            state.board[firstMove[0]][firstMove[1]] = 0;
            if (agent == 0 ){
                state.numBlackPieces = state.numBlackPieces - moves.length + 1;
            } else {
                state.numRedPieces = state.numRedPieces - moves.length + 1;
            }
        }
        return state;
    }

    getLegalActions(agent) {
        if (agent == 0) {
            for(var x = 0; x < this.WIDTH; x++) {
                for(var y = 0; y < this.HEIGHT; y ++) {
                    if(this.board[x][y] == 1) {
                        if (inBounds(x+1, y-1) && this.board[x+1][y-1]) {
                            
                        }
                    }
                }
            }
        }
    }
}

class minimaxAgent {
    constructor() {
        this.depth = 4;
    }

    getAction(checkersState) {
        get_best_action(checkersState, depth, max_depth, agent) { //eval function in state
            var legal_actions = checkersState.getLegalActions(agent);
            if (checkersState.isWin(agent) == true || checkersState.isLose(agent) == true || legal_actions.length == 0) {
                return [null, checkersState.getScore()];
            }    
            var next_states = [];
            for (action in legal_actions) {
                next_states.push(checkersState.generateSuccessor(action, agent));
            }
            var best_action = null;
            var best_score = null;
            if (agent == 0) { // player
                for (i = 0; i < next_states.length; i++) { 
                    var next_state = next_states[i];
                    var next_score = null;
                    if (depth == max_depth) {
                        next_score = checkersState.getScore()
                    } else {
                        next_score = get_best_action(next_state, depth, max_depth, 1)[1];
                    } 
                    if (i == 0) {
                        best_action = 0;
                        best_score = next_score;
                    } else {
                        if (next_score > best_score) {
                            best_action = i;
                            best_score = next_score;
                        }
                    }
                }
                return (legal_actions[best_action], best_score)
            } else { //computer
                for (i = 0; i < next_states.length; i++) { 
                    var next_state = next_states[i];
                    var next_score = get_best_action(next_state, depth + 1, max_depth, 1)[1];
                    if (i == 0) {
                        best_action = 0;
                        best_score = next_score;
                    } else {
                        if (next_score < best_score) {
                            best_action = i;
                            best_score = next_score;
                        }
                    }
                }
                return (legal_actions[best_action], best_score)
            }
        }

    var best_action = get_best_action(checkersState, 0, self.depth, 0)
    return best_action[0]
    }
}

minimaxAgent = new minimaxAgent();
game = new checkersGame();


game.numRedPieces = 2
console.log(game.getScore());
game.numRedPieces = 0
console.log(game.getScore());



