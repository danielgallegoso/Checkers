class NaiveMinimaxAgent {
  constructor() {
    var evalFunc = function(game) {
      return game.getScore();
    }
    this.minimax = new minimaxAgent(evalFunc, 4, 0);
  }

  getAction(game) {
    return this.minimax.getAction(game);
  }
}
