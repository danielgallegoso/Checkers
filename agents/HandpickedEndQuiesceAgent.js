class HandpickedEndQuiesceAgent {
  constructor(agent) {
    var weights = [10, 15, 1, 1.5, 0,0,2,1,.5,.5,-1,-.5,.5,1];
    var evalFunc = function(game) {
      var score = 0;
      var fastFactors = new FastFactors(game);
      var factors = fastFactors.eightFactorArray(agent);
      for (var i in factors) {
        score += factors[i] * weights[i];
      }
      return score;
    }
    this.minimax = new qMinimaxAgent(evalFunc, 4, agent);
  }

  getAction(game) {
    return this.minimax.getAction(game);
  }
}
