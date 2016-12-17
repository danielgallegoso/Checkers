class HandpickedQMinimaxAgent {
  constructor(agent) {
    var evalFunc = function(game) {
      var score = 0;
      score += numberOfPawns(game, agent) * 10;
      score += numberOfKings(game, agent) * 15;
      score += numSafePawns(game, agent) * 1;
      score += numSafeKings(game, agent) * 1.5;
      score += numCentralPawns(game, agent) * 2;
      score += numCentralKings(game, agent) * 1;
      return score;
    }
    this.minimax = new qMinimaxAgent(evalFunc, 4, agent);
  }

  getAction(game) {
    return this.minimax.getAction(game);
  }
}
