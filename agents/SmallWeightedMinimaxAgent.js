class SmallWeightedMinimaxAgent {
  constructor(weights, agent, depth) {
    var evalFunc = function(game) {
      var score = 0;
      score += numberOfPawns(game, agent) * weights[0];
      score += numberOfKings(game, agent) * weights[1];
      score += numDefenders(game, agent) * weights[2];
      score += numAttackers(game, agent) * weights[3];
      score += numCentralPawns(game, agent) * weights[4];
      score += numCentralKings(game, agent) * weights[5];
      score += numHoles(game, agent) * weights[6];
      return score;
    }
    this.minimax = new minimaxAgent(evalFunc, depth, agent);
  }

  getAction(game) {
    return this.minimax.getAction(game);
  }
}
