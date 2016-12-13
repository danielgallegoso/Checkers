
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

    for (var i = 0; i < state.WIDTH; i++) {
        for (var j = 0; j < state.HEIGHT; j++) {
            // numberOfPawns
            if (state.board[i][j] == 1) {
                this.vnumberOfPawns--;
            } else if (state.board[i][j] == 3) {
                this.vnumberOfPawns++;
            }
            // numberOfKings
            if (state.board[i][j] == 2) {
                this.vnumberOfPawns--;
            } else if (state.board[i][j] == 4) {
                this.vnumberOfPawns++;
            }
            // numSafePawns
            if (i == 0 || i == 7 || j == 0 || j == 7) {
                if (state.board[i][j] == 1) {
                  this.vnumSafePawns--;
                } else if (state.board[i][j] == 3) {
                    this.vnumSafePawns++;
                }
            }
            // numSafeKings
            if (i == 0 || i == 7 || j == 0 || j == 7) {
                if (state.board[i][j] == 2) {
                    this.vnumSafeKings--;
                } else if (state.board[i][j] == 4) {
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
