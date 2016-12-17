class NaiveMinimaxAgent {
  constructor(agent) {
    var evalFunc = function(game) {
      return game.getScore();
    }
    this.minimax = new minimaxAgent(evalFunc, 4, agent);
  }

  getAction(game) {
    return this.minimax.getAction(game);
  }
}
