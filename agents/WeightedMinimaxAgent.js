class WeightedMinimaxAgent {
  constructor(weights) {
    var evalFunc = function(game) {
      var score = 0;
      score += numberOfPawns(game) * weights[0];
      score += numberOfKings(game) * weights[1];
      score += numSafePawns(game) * weights[2];
      score += numSafeKings(game) * weights[3];
      score += numMovablePawns(game) * weights[4];
      score += numMovableKings(game) * weights[5];
      score += distanceToPromotion(game) * weights[6];
      score += promotionAvailability(game) * weights[7];
      score += numDefenders(game) * weights[8];
      score += numAttackers(game) * weights[9];
      score += numCentralPawns(game) * weights[10];
      score += numCentralKings(game) * weights[11];
      score += numPawnsMainDiagonal(game) * weights[12];
      score += numKingsMainDiagonal(game) * weights[13];
      score += numPawnsDoubleDiagonal(game) * weights[14];
      score += numKingsDoubleDiagonal(game) * weights[15];
      score += numHoles(game) * weights[16];
      score += numLonerPawns(game) * weights[17];
      score += numLonerKings(game) * weights[18];
      return game.getScore();
    }
    this.minimax = new minimaxAgent(evalFunc, 4);
  }

  getAction(game) {
    return this.minimax.getAction(game);
  }
}
