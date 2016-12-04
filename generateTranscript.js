fs = require('fs');
fs.appendFile('transcripttest.txt', 'test');

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

function equal(arr1, arr2) {
    if (arr1.length != arr2.length) return false;
    for (var i=0; i<arr1.length; i++) {
        if(arr1[i]!=arr2[i]) return false;
    }
    return true;
}

function generateTranscript(){
/*
    var txtFile = "transcript.txt";
    var file = new File(txtFile);
    var str = "My string of text";

    file.open("w"); // open file with write access
    file.writeln("First line of text");
    file.writeln("Second line of text " + str);
    file.write(str);
    file.close();
    */

    var games = [];
    var game1 = "1. 12-16 21-17 2. 9-14 24-19 3. 14x21 19x12 4. 11-16 28-24 5. 5-9 22-17 6. 16-20 17-13 7. 8-11 24-19 8. 11-15 19-16 9. 4-8 25-22 10. 8-11 12-8 11. 3x19 23x16 12. 9-14 29-25 13. 15-19 16-12 14. 11-15 12-8 15. 14-18 22-17 16. 19-23 26x19 17. 15x24 8-3 18. 24-28 31-26 19. 7-11 27-24 20. 20x27 32x7 21. 28-32 25-22 22. 32-27 22-18 23. 11-16";
    var game2 = "1. 9-14 22-18 2. 11-15 18x11 3. 8x15 25-22 4. 5-9 29-25 5. 1-5 24-20 6. 7-11 22-17 7. 3-7 28-24 8. 9-13 25-22 9. 14-18 23x14 10. 4-8 24-19 11. 15x24 22-18 12. 13x22 26x17 13. 10-15 32-28 14. 15x22 28x19 15. 22-25 27-24 16. 6-9 14-10 17. 7x14 17x10 18. 9-14 10-7 19. 25-29 7-3 20. 29-25 19x15 21. 11x18 24-19 22. 25-22 19-16 23. 12x19 3x12 24. 22-17 12-16 25. 17-22 16x23 26. 18x27 31x24 27. 22-18 30-26 28. 18-15 26-22 29. 14-18 24-19 30. 15x24 22x15 31. 24-19 15-11 32. 19-15 11-8 33. 15-11 8-3 34. 2-6 21-17 35. 5-9 1-0";
    var game3 = "1. 11-15 21-17 2. 8-11 17-13 3. 9-14 22-18 4. 15x22 25x9 5. 5x14 29-25 6. 4-8 25-22 7. 10-15 23-18 8. 14x23 26x10 9. 7x14 31-26 10. 6-10 22-18 11. 14x23 27x18 12. 10-15 26-22 13. 12-16 24-20 14. 15-19 30-25 15. 8-12 18-15 16. 11x18 22x15 17. 19-23 20x11 18. 23-26 15-10 19. 26-30 25-21 20. 30-26 21-17 21. 26-23 17-14 22. 2-6 11-7 23. 6x15 7-2 24. 15-18 28-24 25. 12-16 24-20 26. 16-19 14-10 27. 18-22 2-7 28. 22-26 20-16 29. 26-31 16-12 30. 31-27 7-11 31. 27-24 10-6 32. 1x10 11-15 33. 24-20 15x6 34. 23-18 6-10 35. 19-23 13-9 36. 23-26 9-6 37. 20-16 6-2 38. 18-15";
    var game4 = "1. 11-16 22-18 2. 7-11 18-14 3. 10x17 21x14 4. 9x18 23x14 5. 3-7 26-23 6. 6-9 24-19 7. 9x18 23x14 8. 16x23 27x18 9. 11-15 18x11 10. 8x15 25-22 11. 1-6 30-25 12. 4-8 32-27 13. 8-11 31-26 14. 11-16 22-17 15. 16-20 25-21 16. 15-19 29-25 17. 7-11 27-23 18. 11-16 25-22 19. 20-24 22-18 20. 24-27";
    var game5 = "1. 12-16 22-18 2. 16-19 24x15 3. 10x19 23x16 4. 11x20 21-17 5. 6-10 17-13 6. 1-6 26-23 7. 8-11 25-22 8. 10-15 23-19 9. 15x24 28x19 10. 7-10 29-25 11. 4-8 18-15 12. 11x18 22x15 13. 9-14 25-21 14. 14-18 30-25 15. 10-14 31-26 16. 6-9 13x6 17. 2x9 26-22 18. 18-23 27x18 19. 14x23 15-10 20. 20-24 10-6 21. 24-27 6-2 22. 27-31 2-6 23. 9-13 6-10 24. 23-26 19-16 25. 8-12 16-11 26. 26-30 22-18 27. 13-17 21x14 28. 30x21 11-7 29. 31-26 7-2 30. 26-23 10-6 31. 21-17 14-10 32. 23x7 2x11 33. 17-13 11-15 34. 5-9 15-18 35. 12-16 18-22 36. 9-14 6-10 37. 14-17 22-18 38. 17-21 18-22 39. 13-9 10-15 40. 9-6 15-11 41. 16-20 11-15 42. 3-7 15-19 43. 7-10 19-23 44. 6-9 23-26 45. 20-24 26-31 46. 24-28 31-26 47. 9-13 26-30 48. 10-14 22-26 49. 14-18 26-31 50. 18-22 31-27 51. 22-25 30-26 52. 25-29 27-23 53. 29-25 26-30 54. 25-22 23-19 55. 13-9 19-24 56. 9-14 24-20 57. 14-10 20-24 58. 10-7 24-19 59. 22-18 19-24 60. 18-15 24-20 61. 7-11 20-24 62. 11-16 24-27 63. 16-20 27-31 64. 20-24 31-26 65. 15-18 26-31 66. 21-25 30x21 67. 18-22 32-27 68. 24-19 27-24 69. 19-23 24-20 70. 23-19 31-27 71. 28-32 27-31 72. 19-24 20-16 73. 32-28";
    var game6 = "1. 12-16 22-18 2. 16-20 24-19 3. 11-15 18x11 4. 8x24 28x19 5. 4-8 25-22 6. 8-11 23-18 7. 9-13 29-25 8. 10-15 19x10 9. 6x15 21-17 10. 5-9 25-21 11. 1-5 32-28 12. 3-8 27-24 13. 20x27 31x24 14. 7-10 17-14 15. 10x17 21x14 16. 13-17 22x6 17. 15x31 6-1 18. 31-27 24-20 19. 8-12 30-26 20. 11-15 14-10 21. 15-18 26-23 22. 18-22 23-19 23. 22-26 19-15 24. 26-30 15-11 25. 30-26 11-8 26. 26-23 28-24 27. 23-18 8-3 28. 27-32 24-19 29. 18-15 19-16 30. 12x19 3-8 31. 15x6 1x10 32. 19-23 8-11 33. 23-26 11-15 34. 32-27 20-16 35. 26-30 10-14 36. 27-23 16-11 37. 2-6 11-7 38. 6-9 14-17 39. 9-13 17-21 40. 30-26 7-2 41. 26-22 2-6 42. 23-18 21-25 43. 22x29 15x22 44. 5-9 22-18 45. 29-25 6-1 46. 13-17 1-6 47. 9-13 6-9 48. 17-21";
    var game7 = "1. 10-15 22-17 2. 11-16 23-18 3. 15x22 25x18 4. 9-14 17x10 5. 6x22 26x17 6. 8-11 29-25 7. 4-8 17-13 8. 1-6 21-17 9. 7-10 27-23 10. 11-15 24-19 11. 15x24 28x19 12. 8-11 30-26 13. 11-15 32-27 14. 15x24 27x11 15. 2-7 11x2 16. 10-15 2x9 17. 5x30 26-22 18. 30-26 23-18 19. 26x17 18x11 20. 12-16 31-26 21. 16-19 13-9 22. 17-14 9-5 23. 14-18";
    var game8 = "1. 10-15 23-19 2. 7-10 22-17 3. 11-16 26-23 4. 8-11 17-14 5. 9x18 23x7 6. 3x10 25-22 7. 16x23 27x18 8. 4-8 30-26 9. 10-14 18x9 10. 5x14 24-20 11. 15-18 22x15 12. 11x18 32-27 13. 8-11 29-25 14. 6-9 26-22 15. 18-23 27x18 16. 14x23 22-18 17. 2-6 28-24 18. 6-10 24-19 19. 1-5 25-22 20. 9-13 21-17 21. 5-9 19-15 22. 10x19 17-14 23. 23-26 14x5 24. 26-30 18-14 25. 11-15 5-1 26. 30-25 1-5 27. 25x9 5x14 28. 19-24 14-10 29. 15-18 10-15 30. 18-22 15-19 31. 24-28 20-16 32. 22-25 16-11 33. 25-30 11-8 34. 30-25 8-4 35. 25-22 19-23 36. 13-17 4-8 37. 17-21 8-11 38. 28-32 11-15 39. 21-25 23-26 40. 22-17 26-30 41. 25-29 15-19 42. 17-14 19-24 43. 14-18 24-20 44. 18-23 20-24 45. 32-28 24-20 46. 23-27 31x24 47. 28x19 20-16 48. 19-23 16-20 49. 23-27 30-26 50. 29-25 26-31 51. 27-23 20-24 52. 25-22 24-28 53. 12-16 28-32 54. 16-19 31-27 55. 23-18 32-28 56. 19-23 28-32 57. 22-17";
    var game9 = "1. 11-16 22-18 2. 7-11 25-22 3. 3-7 29-25 4. 16-19 24x15 5. 10x19 23x16 6. 12x19 21-17 7. 9-13 17-14 8. 6-10 27-24 9. 10x17 24x15 10. 17-21 32-27 11. 11-16 18-14 12. 2-6 22-18 13. 6-10 15x6 14. 1x17 18-14 15. 8-12 27-24 16. 16-20 24-19 17. 20-24 19-15 18. 4-8 28x19 19. 7-11 14-10 20. 11x18 26-22 21. 17x26 31x15 22. 5-9 10-7 23. 9-14 7-2 24. 14-18 2-6 25. 18-23 25-22 26. 23-27 6-10 27. 27-32 10-14 28. 32-27 14-18 29. 27-24 18-23 30. 24-20 23-26 31. 20-24 15-11 32. 8x15 19x10 33. 24-27 26-31 34. 27-23 10-6 35. 12-16 6-1 36. 16-20 1-6 37. 20-24 6-9 38. 24-28 31-26 39. 23-27 22-18 40. 27-31 26-22 41. 28-32 18-14 42. 32-27 14-10 43. 27-32 9-14 44. 32-27 10-7 45. 27-32 14-18 46. 32-27 7-3 47. 27-32 3-8 48. 32-27 8-11 49. 27-32 18-23 50. 32-28 11-16 51. 28-32 16-20 52. 31-27 23-19 53. 32-28 22-26 54. 27-31 26-23 55. 28-32 23-18 56. 31-27 19-23 57. 27-31 20-24 58. 32-28 23-19 59. 28-32 24-28 60. 13-17 19-24 61. 32-27 24-20 62. 27-32 20-16 63. 31-27 16-19 64. 27-31 19-15 65. 31-27 15-19 66. 27-31";
    var game10 = "1. 11-16 22-18 2. 7-11 24-19 3. 3-7 28-24 4. 16-20 25-22 5. 11-15 18x11 6. 8x15 32-28 7. 4-8 21-17 8. 7-11 19-16 9. 12x19 23x7 10. 2x11 26-23 11. 9-13 23-18 12. 6-9 24-19 13. 15x24 28x19 14. 9-14 18x9 15. 5x21 19-16 16. 11-15 16-12 17. 8-11 12-8 18. 10-14 8-3 19. 14-17 3-7 20. 17x26 7x16 21. 1-5 31x22 22. 5-9 27-23 23. 15-19 23-18 24. 19-24 16-19 25. 24-28 18-15 26. 9-14 15-11 27. 28-32 11-7 28. 14-17 22-18 29. 32-28 7-2 30. 20-24 2-7 31. 24-27 7-10 32. 27-31 10-14 33. 28-32 18-15 34. 32-27 14-18 35. 17-22 18x25 36. 31-26 30x23 37. 21x30 15-10 38. 27x18 19-24";

    games.push(game1);
    games.push(game2);
    games.push(game3);
    games.push(game4);
    games.push(game5);
    games.push(game6);
    games.push(game7);
    games.push(game8);
    games.push(game9);
    games.push(game10);

    var map = new Object();
    map['1'] = [1,0];
    map['2'] = [3,0];
    map['3'] = [5,0];
    map['4'] = [7,0];
    map['5'] = [0,1];
    map['6'] = [2,1];
    map['7'] = [4,1];
    map['8'] = [6,1];

    map['9'] = [1,2];
    map['10'] = [3,2];
    map['11'] = [5,2];
    map['12'] = [7,2];
    map['13'] = [0,3];
    map['14'] = [2,3];
    map['15'] = [4,3];
    map['16'] = [6,3];

    map['17'] = [1,4];
    map['18'] = [3,4];
    map['19'] = [5,4];
    map['20'] = [7,4];
    map['21'] = [0,5];
    map['22'] = [2,5];
    map['23'] = [4,5];
    map['24'] = [6,5];

    map['25'] = [1,6];
    map['26'] = [3,6];
    map['27'] = [5,6];
    map['28'] = [7,6];
    map['29'] = [0,7];
    map['30'] = [2,7];
    map['31'] = [4,7];
    map['32'] = [6,7];

    var output = [];

    //console.log(moves);
  //  test = moves[1];
    //console.log(test.split('-'));

/*
    agentZeroMove = moves[1];
    var move = agentZeroMove.split('-');
    if(move.length!=2) {
        move = agentZeroMove.split('x');
    }
    move[0] = map[move[0]];
    move[1] = map[move[1]];
    */
    //fs.appendFile('transcripttest.txt', JSON.stringify(game.board));
    //fs.appendFile('transcripttest.txt', '\n');
    for (g = 0; g < games.length; g++) {

        input = games[g];
        var moves = input.split(' ');
        var game = new checkersGame();
        for (var i=0; i <moves.length; i+=3) {
            console.log('Turn');
            agentZeroMove = moves[i+1];
            var move = agentZeroMove.split('-');
            if(move.length!=2) {
                move = agentZeroMove.split('x');
            }
            move[0] = map[move[0]];
            move[1] = map[move[1]];
            actions = game.getLegalActions(0);


            for(var a = 0; a < actions.length; a++) {

                if(equal(actions[a][0], (move[0])) && equal(actions[a][actions[a].length-2], move[1])) {

                    var moveRecord = new Object;
                    moveRecord['board'] = game.board;
                    moveRecord['move'] = actions[a];
                    output.push(moveRecord);
                    console.log(actions[a]);
                    //fs.appendFile('transcripttest.txt', JSON.stringify(actions[a]));
                    //fs.appendFile('transcripttest.txt', '\n\n');
                    game = game.generateSuccessor(actions[a], 0);
                    console.log(game.board);
                    //fs.appendFile('transcripttest.txt', JSON.stringify(game.board));
                    //fs.appendFile('transcripttest.txt', '\n');
                    break;
                }
            }

            if(i+2 < moves.length) {
                agentOneMove = moves[i+2];
                var move = agentOneMove.split('-');
                if(move.length!=2) {
                    move = agentOneMove.split('x');
                }
                move[0] = map[move[0]];
                move[1] = map[move[1]];
                actions = game.getLegalActions(1);
                for(var a = 0; a < actions.length; a++) {
                    if(equal(actions[a][0],move[0]) && equal(actions[a][actions[a].length-2],move[1])) {
                        //console.log(actions[a]);
                        game = game.generateSuccessor(actions[a], 1);
                        break;
                        //console.log(game.board);
                    }
                }
            }
        }
    }

    fs.appendFile('transcripttest.json', JSON.stringify(output));


}

generateTranscript();