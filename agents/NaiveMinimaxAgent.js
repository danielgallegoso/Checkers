class NaiveMinimaxAgent {
  constructor(agent) {
    var evalFunc = function(game) {
        if (agent == 0) {
            score = checkersState.getScore();
        } else {
            score = 0 - checkersState.getScore();
        }
      	return score;
    }
    this.minimax = new minimaxAgent(evalFunc, 4, agent);
  }

  getAction(game) {
  	return this.minimax.getAction(game);
  }
}
