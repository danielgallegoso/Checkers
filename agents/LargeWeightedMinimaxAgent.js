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
