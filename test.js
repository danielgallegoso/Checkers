//
//
//
// class checkersGame {
//     //This class will make the state for our minimax problem
//     //Agent - 0 is the red, the bottom rows
//     //Agent - 1 is black, the top rows
//     // 1 - Red player
//     // 2 - Red king
//     // 3 - Black player
//     // 4 - Black king
//
//     constructor() {
//         this.WIDTH = 8;
//         this.HEIGHT = 8;
//         this.numRedPieces = 13;
//         this.numBlackPieces = 13;
//         this.board = new Array(8); // this.agent!
//         for (var i = 0; i < 8; i++) {
//             this.board[i] = new Array(8);
//         }
//         for (var i = 0; i < 8; i++) {
//             for (var j = 0; j < 8; j++) {
//                 this.board[i][j] = 0;
//             }
//         }
//         for (var i = 0; i < 3; i++){
//             for(var j = (1 + i)%2; j < 8; j+=2) {
//                 this.board[i][j] = 1;
//             }
//         }
//         for (var i = 5; i < 8; i++){
//             for(var j = (i+1)%2; j < 8; j+=2) {
//                 this.board[i][j] = 3;
//             }
//         }
//
//         //Binding
//         this.isWin = this.isWin.bind(this);
//         this.isLose = this.isLose.bind(this);
//         this.getScore = this.getScore.bind(this);
//
//         this.generateSuccessor = this.generateSuccessor.bind(this);
//         this.getLegalActions = this.getLegalActions.bind(this);
//         this.inBounds = this.inBounds.bind(this);
//         this.recursiveEatSearch = this.recursiveEatSearch.bind(this);
//
//         this.setBoard = this.setBoard.bind(this);
//
//     }
//
//     isWin(agent) {
//         if (agent  == 0) {
//             if (this.numBlackPieces == 0 || this.getLegalActions(1).length == 0) {
//                 return true;
//             }
//         } else if (agent == 1) {
//             if(this.numRedPieces == 0 || this.getLegalActions(0).length == 0) {
//                 return true;
//             }
//         }
//         return false;
//     }
//
//     isLose(agent) {
//         if (agent  == 0) {
//             if (this.numRedPieces == 0 || this.getLegalActions(agent).length == 0) {
//                 return true;
//             }
//         } else if (agent == 1) {
//             if(this.numBlackPieces == 0 || this.getLegalActions(agent).length == 0) {
//                 return true;
//             }
//         }
//         return false;
//     }
//
//     inBounds(x, y) {
//         if (x >= 0 && x < this.WIDTH && y >= 0 && y < this.HEIGHT) {
//             return true;
//         }
//         return false;
//     }
//
//     getScore() {
//         if (this.isWin(0)) {
//             return Infinity;
//         } else if(this.isWin(1)) {
//             return (0 - Infinity);
//         } else {
//             return this.numRedPieces - this.numBlackPieces;
//         }
//     }
//
//     setBoard(input) {
//         var inputArray = input.split("~");
//         //console.log(inputArray);
//         for (var i = 0; i < inputArray.length; i++) {
//             //console.log(inputArray[i]);
//             for (var j = 0; j < inputArray[i].length; j++) {
//               //console.log(i + " " + j);
//                 this.board[i][j] = parseInt(inputArray[i][j]);
//             }
//         }
//     }
//
//     // action = [[(0,0), ... , (4,4)], 1]
//     // If the second element of the array is 1, then the action involves eating pieces
//     // If not, then the action does not involve eating pieces.
//
//     generateSuccessor(action, agent) {
//         var state = new checkersGame();
//         state.numRedPieces = this.numRedPieces;
//         state.numBlackPieces = this.numBlackPieces;
//         for(var x = 0; x < this.WIDTH; x++) {
//             for(var y = 0; y < this.HEIGHT; y++) {
//                 state.board[y][x] = this.board[y][x]
//             }
//         }
//
//         var firstMove = action[0];
//         var lastMove = action[action.length - 2];
//         var eating = action[action.length - 1];
//
//         if(eating == 0) {
//             state.board[lastMove[1]][lastMove[0]] = state.board[firstMove[1]][firstMove[0]];
//             if(agent == 0 && lastMove[1] == 7) {
//                 state.board[lastMove[1]][lastMove[0]]=2;
//             } else if(agent == 1 && lastMove[1] == 0) {
//                 state.board[lastMove[1]][lastMove[0]]=4;
//             }
//             state.board[firstMove[1]][firstMove[0]] = 0;
//         } else {
//             var containsUpgrade = false;
//             for (var i = 0; i < action.length - 2; i ++) {
//                 var first = action[i];
//                 var second = action[i+1];
//                 // console.log('x:', (first[1] + second[1]) / 2, ' y:', (first[0] + second[0]) / 2);
//                 state.board[(first[1] + second[1]) / 2][(first[0] + second[0]) / 2] = 0;
//                 if (agent == 0 && second[1] == 7) {
//                     containsUpgrade = true;
//                 } else if (agent == 1 && second[1] == 0) {
//                     containsUpgrade = true;
//                 }
//             }
//             state.board[lastMove[1]][lastMove[0]] = state.board[firstMove[1]][firstMove[0]];
//             state.board[firstMove[1]][firstMove[0]] = 0;
//
//             if (agent == 0 ){
//                 state.numBlackPieces = state.numBlackPieces - action.length + 2;
//                 if (containsUpgrade) {
//                     state.board[lastMove[1]][lastMove[0]] = 2;
//                 }
//             } else {
//                 state.numRedPieces = state.numRedPieces - action.length + 2;
//                 if (containsUpgrade) {
//                     state.board[lastMove[1]][lastMove[0]] = 4;
//                 }
//             }
//         }
//
//         return state;
//     }
//
//     getLegalActions(agent) {
//         var actions = []
//         if (agent == 0) {
//             for(var x = 0; x < this.WIDTH; x++) {
//                 for(var y = 0; y < this.HEIGHT; y ++) {
//                     if(this.board[y][x] == 1 || this.board[y][x] == 2) {
//                         var path = [[x,y]];
//                         var numActions = actions.length;
//                         this.recursiveEatSearch(x, y, this.board[y][x], actions, path);
//                         if (actions.length > numActions) {
//                             continue;
//                         }
//
//                         if (this.inBounds(y+1, x+1) && this.board[y+1][x+1]==0) {
//                             actions.push([[x,y],[x+1,y+1],0]);
//                         }
//                         if (this.inBounds(y+1, x-1) && this.board[y+1][x-1]==0) {
//                             actions.push([[x, y],[x-1,y+1],0]);
//                         }
//                     } if(this.board[y][x] == 2) {
//                         if (this.inBounds(y-1, x+1) && this.board[y-1][x+1]==0) {
//                             actions.push([[x,y],[x+1,y-1],0]);
//                         }
//                         if (this.inBounds(y-1, x-1) && this.board[y-1][x-1]==0) {
//                             actions.push([[x, y],[x-1,y-1],0]);
//                         }
//                     }
//                 }
//             }
//         } else if (agent == 1) {
//             for(var x = 0; x < this.WIDTH; x++) {
//                 for(var y = 0; y < this.HEIGHT; y ++) {
//                     if(this.board[y][x] == 3 || this.board[y][x] == 4) {
//                         var path = [[x,y]];
//                         var numActions = actions.length;
//                         this.recursiveEatSearch(x, y, this.board[y][x], actions, path);
//                         if (actions.length > numActions) {
//                             continue;
//                         }
//
//                         if (this.inBounds(y-1, x+1) && this.board[y-1][x+1]==0) {
//                             actions.push([[x,y],[x+1,y-1],0]);
//                         }
//                         if (this.inBounds(y-1, x-1) && this.board[y-1][x-1]==0) {
//                             actions.push([[x, y],[x-1,y-1],0]);
//                         }
//                     } if(this.board[y][x] == 4) {
//                         if (this.inBounds(y+1, x+1) && this.board[y+1][x+1]==0) {
//                             actions.push([[x,y],[x+1,y+1],0]);
//                         }
//                         if (this.inBounds(y+1, x-1) && this.board[y+1][x-1]==0) {
//                             actions.push([[x, y],[x-1,y+1],0]);
//                         }
//                     }
//                 }
//             }
//         }
//         var canEat = false;
//         for (var i = 0; i < actions.length; i++) {
//             var action = actions[i];
//             if (action[action.length - 1] == 1) {
//                 canEat = true;
//             }
//         }
//         if (canEat) {
//             for(var i = 0; i <actions.length; i++) {
//                 var action = actions[i];
//                 if (action[action.length - 1] == 0) {
//                     actions.splice(i, 1);
//                     i--;
//                 }
//             }
//         }
//         return actions;
//     }
//
//     recursiveEatSearch(x, y, piece, actions, path) {
//         if(piece == 1) {
//             var foundMove = false;
//             if (y+2 == 7) {
//                 //console.log('upgrade?');
//                 piece = 2;
//             }
//             if (this.inBounds(y+1, x+1) && this.board[y+1][x+1]>2 && this.inBounds(y+2, x+2) && this.board[y+2][x+2]==0) {
//                 foundMove = true;
//                 path.push([x+2, y+2]);
//                 var oldValue = this.board[y+1][x+1];
//
//                 this.board[y+1][x+1] = 0;
//                 this.recursiveEatSearch(x+2, y+2, piece, actions, path);
//                 this.board[y+1][x+1] = oldValue
//
//                 path.pop();
//             }
//             if (this.inBounds(y+1, x-1) && this.board[y+1][x-1]>2 && this.inBounds(y+2, x-2) && this.board[y+2][x-2]==0) {
//                 foundMove = true;
//                 path.push([x-2, y+2]);
//                 var oldValue = this.board[y+1][x-1];
//                 this.board[y+1][x-1] = 0;
//                 this.recursiveEatSearch(x-2, y+2, piece, actions, path);
//                 this.board[y+1][x-1] = oldValue;
//                 path.pop();
//             }
//             if(!foundMove && path.length > 1) {
//                 //console.log(path);
//
//                 var pathCopy = [];
//                 for (var i = 0; i < path.length; i++) {
//                     pathCopy.push(path[i])
//                 }
//                 pathCopy.push(1)
//                 actions.push(pathCopy);
//
//                 //console.log(actions);
//             }
//         } else if (piece == 2) {
//             var foundMove = false;
//             if (this.inBounds(y+1, x+1) && this.board[y+1][x+1]>2 && this.inBounds(y+2, x+2) && this.board[y+2][x+2]==0) {
//                 foundMove = true;
//                 path.push([x+2, y+2]);
//                 var oldValue = this.board[y+1][x+1];
//                 this.board[y+1][x+1] = 0;
//                 this.recursiveEatSearch(x+2, y+2, piece, actions, path);
//                 this.board[y+1][x+1] = oldValue;
//                 path.pop();
//             }
//             if (this.inBounds(y+1, x-1) && this.board[y+1][x-1]>2 && this.inBounds(y+2, x-2) && this.board[y+2][x-2]==0) {
//                 foundMove = true;
//                 path.push([x-2, y+2]);
//                 var oldValue = this.board[y+1][x-1];
//                 this.board[y+1][x-1] = 0;
//                 this.recursiveEatSearch(x-2, y+2, piece, actions, path);
//                 this.board[y+1][x-1] = oldValue;
//                 path.pop();
//             }
//             if (this.inBounds(y-1, x+1) && this.board[y-1][x+1]>2 && this.inBounds(y-2, x+2) && this.board[y-2][x+2]==0) {
//                 foundMove = true;
//                 path.push([x+2, y-2]);
//                 var oldValue = this.board[y-1][x+1];
//                 this.board[y-1][x+1] = 0;
//                 this.recursiveEatSearch(x+2, y-2, piece, actions, path);
//                 this.board[y-1][x+1] = oldValue
//                 path.pop();
//             }
//             if (this.inBounds(y-1, x-1) && this.board[y-1][x-1]>2 && this.inBounds(y-2, x-2) && this.board[y-2][x-2]==0) {
//                 foundMove = true;
//                 path.push([x-2, y-2]);
//                 var oldValue = this.board[y-1][x-1];
//                 this.board[y-1][x-1] = 0;
//                 this.recursiveEatSearch(x-2, y-2, piece, actions, path);
//                 this.board[y-1][x-1] = oldValue;
//                 path.pop();
//             }
//             if(!foundMove && path.length > 1) {
//                 //console.log(path);
//
//                 var pathCopy = [];
//                 for (var i = 0; i < path.length; i++) {
//                     pathCopy.push(path[i])
//                 }
//                 pathCopy.push(1)
//                 actions.push(pathCopy);
//
//                 //console.log(actions);
//             }
//         } else if(piece == 3) {
//             var foundMove = false;
//             if (y-2 == 0) {
//                 //console.log('upgrade?')
//                 piece = 4
//             }
//             if (this.inBounds(y-1, x+1) && (this.board[y-1][x+1]==1 || this.board[y-1][x+1]==2)  && this.inBounds(y-2, x+2) && this.board[y-2][x+2]==0) {
//                 foundMove = true;
//                 path.push([x+2, y-2]);
//                 var oldValue = this.board[y-1][x+1];
//                 this.board[y-1][x+1] = 0;
//                 this.recursiveEatSearch(x+2, y-2, piece, actions, path);
//                 this.board[y-1][x+1] = oldValue
//                 path.pop();
//             }
//             if (this.inBounds(y-1, x-1) && (this.board[y-1][x-1]==1 || this.board[y-1][x-1]==2) && this.inBounds(y-2, x-2) && this.board[y-2][x-2]==0) {
//                 foundMove = true;
//                 path.push([x-2, y-2]);
//                 var oldValue = this.board[y-1][x-1];
//                 this.board[y-1][x-1] = 0;
//                 this.recursiveEatSearch(x-2, y-2, piece, actions, path);
//                 this.board[y-1][x-1] = oldValue;
//                 path.pop();
//             }
//             if(!foundMove && path.length > 1) {
//                 //console.log(path);
//
//                 var pathCopy = [];
//                 for (var i = 0; i < path.length; i++) {
//                     pathCopy.push(path[i])
//                 }
//                 pathCopy.push(1)
//                 actions.push(pathCopy);
//
//                 //console.log(actions);
//             }
//         } else if (piece == 4) {
//             var foundMove = false;
//             if (this.inBounds(y+1, x+1) && (this.board[y+1][x+1] == 1 || this.board[y+1][x+1] == 2) && this.inBounds(y+2, x+2) && this.board[y+2][x+2]==0) {
//                 foundMove = true;
//                 path.push([x+2, y+2]);
//                 var oldValue = this.board[y+1][x+1];
//                 this.board[y+1][x+1] = 0;
//                 this.recursiveEatSearch(x+2, y+2, piece, actions, path);
//                 this.board[y+1][x+1] = oldValue;
//                 path.pop();
//             }
//             if (this.inBounds(y+1, x-1) && (this.board[y+1][x-1] == 2 || this.board[y+1][x-1] == 1) && this.inBounds(y+2, x-2) && this.board[y+2][x-2]==0) {
//                 foundMove = true;
//                 path.push([x-2, y+2]);
//                 var oldValue = this.board[y+1][x-1];
//                 this.board[y+1][x-1] = 0;
//                 this.recursiveEatSearch(x-2, y+2, piece, actions, path);
//                 this.board[y+1][x-1] = oldValue;
//                 path.pop();
//             }
//             if (this.inBounds(y-1, x+1) && (this.board[y-1][x+1] == 1 || this.board[y-1][x+1] == 2) && this.inBounds(y-2, x+2) && this.board[y-2][x+2]==0) {
//                 foundMove = true;
//                 path.push([x+2, y-2]);
//                 var oldValue = this.board[y-1][x+1];
//                 this.board[y-1][x+1] = 0;
//                 this.recursiveEatSearch(x+2, y-2, piece, actions, path);
//                 this.board[y-1][x+1] = oldValue
//                 path.pop();
//             }
//             if (this.inBounds(y-1, x-1) && (this.board[y-1][x-1] == 1 || this.board[y-1][x-1] == 2) && this.inBounds(y-2, x-2) && this.board[y-2][x-2]==0) {
//                 foundMove = true;
//                 path.push([x-2, y-2]);
//                 var oldValue = this.board[y-1][x-1];
//                 this.board[y-1][x-1] = 0;
//                 this.recursiveEatSearch(x-2, y-2, piece, actions, path);
//                 this.board[y-1][x-1] = oldValue;
//                 path.pop();
//             }
//             if(!foundMove && path.length > 1) {
//                 //console.log(path);
//
//                 var pathCopy = [];
//                 for (var i = 0; i < path.length; i++) {
//                     pathCopy.push(path[i])
//                 }
//                 pathCopy.push(1)
//                 actions.push(pathCopy);
//
//                 //console.log(actions);
//             }
//         }
//     }
// }
//
//
// function shuffle(a) {
//     var j, x, i;
//     for (i = a.length; i; i--) {
//         j = Math.floor(Math.random() * i);
//         x = a[i - 1];
//         a[i - 1] = a[j];
//         a[j] = x;
//     }
// }
//
// class minimaxAgent {
//     constructor(evalFunc, depth) {
//         this.depth = depth;
//         this.evalFunc = evalFunc;
//     }
//
//     getAction(checkersState) {
//         var self = this;
//         var get_best_action = function (checkersState, depth, max_depth, agent, alpha_beta) { //eval function in state
//             if (checkersState.isWin(agent) == true || checkersState.isLose(agent) == true) {
//                 return [null, checkersState.getScore()];
//             }
//             var legal_actions = checkersState.getLegalActions(agent);
//             shuffle(legal_actions);
//             var next_states = [];
//             for (var i in legal_actions) {
//               next_states.push(checkersState.generateSuccessor(legal_actions[i], agent));
//             }
//             var best_action = null;
//             var best_score = null;
//
//             if (agent == 0) { // player
//                 for (var i = 0; i < next_states.length; i++) {
//                     var next_state = next_states[i];
//                     if ((alpha_beta[1] - alpha_beta[0]) > 0) {
//                         var next_score = null;
//                         if (depth == max_depth) {
//                             // next_score = checkersState.getScore()
//                             next_score = self.evalFunc(checkersState);
//                         } else {
//                             next_score = get_best_action(next_state, depth, max_depth, 1, alpha_beta)[1];
//                         }
//                         if (i == 0) {
//                             best_action = 0;
//                             best_score = next_score;
//                             if (best_score > alpha_beta[0]) {
//                                 alpha_beta = [best_score, alpha_beta[1]];
//                             }
//                         } else {
//                             if (next_score > best_score) {
//                                 best_action = i;
//                                 best_score = next_score;
//                                 if (best_score > alpha_beta[0]) {
//                                     alpha_beta = [best_score, alpha_beta[1]]
//                                 }
//                             }
//                         }
//                     }
//                 }
//                 return [legal_actions[best_action], best_score];
//             } else { //computer
//                 for (var i = 0; i < next_states.length; i++) {
//                     var next_state = next_states[i];
//                     if ((alpha_beta[1] - alpha_beta[0]) > 0) {
//                         var next_score = get_best_action(next_state, depth + 1, max_depth, 0, alpha_beta)[1];
//                         if (i == 0) {
//                             best_action = 0;
//                             best_score = next_score;
//                             if (best_score < alpha_beta[1]) {
//                                 alpha_beta = [alpha_beta[0], best_score];
//                             }
//                         } else {
//                             if (next_score < best_score) {
//                                 best_action = i;
//                                 best_score = next_score;
//                                 if (best_score < alpha_beta[1]) {
//                                     alpha_beta = [alpha_beta[0], best_score];
//                                 }
//                             }
//                         }
//                     }
//                 }
//                 return [legal_actions[best_action], best_score];
//             }
//         }
//     var alpha_beta = [0 - Infinity, Infinity];
//     var best_action = get_best_action(checkersState, 0, this.depth, 0, alpha_beta); //state, agent, max_depth = 4, depth, agent, alpha_beta
//     return best_action[0];
//     }
// }
//
// class WeightedMinimaxAgent {
//   constructor(weights) {
//     var evalFunc = function(game) {
//       var score = 0;
//       score += numberOfPawns(game) * weights[0];
//       score += numberOfKings(game) * weights[1];
//       score += numSafePawns(game) * weights[2];
//       score += numSafeKings(game) * weights[3];
//       score += numMovablePawns(game) * weights[4];
//       score += numMovableKings(game) * weights[5];
//       score += distanceToPromotion(game) * weights[6];
//       score += promotionAvailability(game) * weights[7];
//       score += numDefenders(game) * weights[8];
//       score += numAttackers(game) * weights[9];
//       score += numCentralPawns(game) * weights[10];
//       score += numCentralKings(game) * weights[11];
//       score += numPawnsMainDiagonal(game) * weights[12];
//       score += numKingsMainDiagonal(game) * weights[13];
//       score += numPawnsDoubleDiagonal(game) * weights[14];
//       score += numKingsDoubleDiagonal(game) * weights[15];
//       score += numHoles(game) * weights[16];
//       score += numLonerPawns(game) * weights[17];
//       score += numLonerKings(game) * weights[18];
//       return score;
//     }
//     this.minimax = new minimaxAgent(evalFunc, 4);
//   }
//
//   getAction(game) {
//     return this.minimax.getAction(game);
//   }
// }
//
// var weights = [];
// for (i = 0; i < 19; i++) {
// 	weights.push[1]
// }
//
// var fs = require('fs');
// var file = "transcripttest.json"
// var obj = JSON.parse(fs.readFileSync(file, 'utf8'));
//
//
// var successes = 0
// var total = obj.length
// var state = new checkersGame()
// var weightedMinimax = new WeightedMinimaxAgent(weights)
//
// for (var i in obj) {
// 	state.board = obj[i].board;
// 	var redPieces = 0;
// 	var blackPieces = 0;
// 	for (var x = 0; x < state.WIDTH; x++) {
//         for (var y = 0; y < state.HEIGHT; y ++) {
//             if (state.board[y][x] == 1 || state.board[y][x] == 2) {
//             	redPieces++;
//             ) else if (state.board[y][x] == 3 || state.board[y][x] == 4) {
// 				blackPieces++;
// 			}
// 		}
// 	}
// 	state.numRedPieces = redPieces;
// 	state.numBlackPieces = blackPieces;
//
// 	weightedMinimaxAgent.getAction(state)
// 	action = obj[i].move;
// }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
