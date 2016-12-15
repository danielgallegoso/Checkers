class EightFactorEndMinimaxAgent {
  constructor(weights, agent, depth) {
    var evalFunc = function(game) {
      var score = 0;
      var fastFactors = new FastFactors(game);
      var factors = fastFactors.eightFactorArrayEnd(agent);
      for (var i in factors) {
        score += numberOfPawns(game, agent) * 30;
        score += numberOfKings(game, agent) * 20;
        score += numSafePawns(game, agent) * 1;
        score += numSafeKings(game, agent) * 1;
        score += numCentralPawns(game, agent) * 2;
        score += numCentralKings(game, agent) * 1;

        score += numSafePawnsEnd(game, agent) * 2;
        score += numSafeKingsEnd(game, agent) * -1;
        score += numDefendersEnd(game, agent) * -1;
        score += numAttackersEnd(game, agent) * 1;
        score += numCentralPawnsEnd(game, agent) * 2;
        score += numCentralKingsEnd(game, agent) * 5;
      }
      return score;
    }
    this.minimax = new qMinimaxAgent(evalFunc, depth, agent);
  }

  getAction(game) {
    return this.minimax.getAction(game);
  }
}
