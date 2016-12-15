class EightFactorMinimaxAgent {
  constructor(weights, agent, depth) {
    var evalFunc = function(game) {
      var score = 0;
      var fastFactors = new FastFactors(game);
      var factors = fastFactors.eightFactorArray(agent);
      for (var i in factors) {
        score += factors[i] * weights[i];
      }
      return score;
    }
    this.minimax = new minimaxAgent(evalFunc, depth, agent);
  }

  getAction(game) {
    return this.minimax.getAction(game);
  }
}
