function simulateMatchup(p0,p1) {
  var game = new checkersGame();
  var round = 0;
  for (round = 0; round < 100; round++) {
    console.log(round);
    game = game.generateSuccessor(p0.getAction(game),0);
    if (game.isWin(1) || game.isLose(1)) {
      if (game.isWin(1)) {
        console.log("Agent 1 wins in ", round, " turns.");
      } else {
        console.log("Agent 0 wins in ", round, " turns.");
      }
      break;
    }
    game = game.generateSuccessor(p1.getAction(game),1);
    if (game.isWin(0) || game.isLose(0)) {
      if (game.isWin(0)) {
        console.log("Agent 0 wins in ", round, " turns.");
      } else {
        console.log("Agent 1 wins in ", round, " turns.");
      }
      break;
    }
  }
  if (round == 100) {
    console.log("The game ended as a draw.")
  }

  game = new checkersGame();
  for (round = 0; round < 100; round++) {
    console.log(round);
    game = game.generateSuccessor(p1.getAction(game),1);
    if (game.isWin(0) || game.isLose(0)) {
      if (game.isWin(0)) {
        console.log("Agent 0 wins in ", round, " turns.");
      } else {
        console.log("Agent 1 wins in ", round, " turns.");
      }
      break;
    }
    game = game.generateSuccessor(p0.getAction(game),0);
    if (game.isWin(1) || game.isLose(1)) {
      if (game.isWin(1)) {
        console.log("Agent 1 wins in ", round, " turns.");
      } else {
        console.log("Agent 0 wins in ", round, " turns.");
      }
      break;
    }
  }
  if (round == 100) {
    console.log("The game ended as a draw.")
  }
}

// var p0 = new HandpickedMinimaxAgent(0);
var p0 = new RandomAgent();
var p1 = new EightFactorEndMinimaxAgent([26.3588882149776,62.05169804007839,7.823861336714351,7.877946970595879,0.8043990603097557,-6.285835915862558,-7.004397236139457,4.3283898351096495,1.4791722087807897,-3.1977215422581704,-2.3113625371927182,-5.224852895753143,0.5808764183966684,2.8696641987523694],1,4)
simulateMatchup(p0,p1);
