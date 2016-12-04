class AgentEvolution {
  constructor(popSize) {
    this.winner = []
    for (var i = 0; i < 19; i++) this.winner[i] = 0;
    this.popSize = popSize;
  }

  newWeights() {
    var result = [];
    for (var i = 0; i < this.winner.length; i++) {
      result[i] = this.winner[i] + Math.random() * 2 - 1;
    }
    return result;
  }

  simulateGame(w0, w1) {
    var p0 = new WeightedMinimaxAgent(w0, 0, 3);
    var p1 = new WeightedMinimaxAgent(w1, 1, 3);
    // console.log(w0, w1)
    for (var a = 0; a < 5; a++) {
      console.log(a)
      var game = new checkersGame();
      for (var round = 0; round < 100; round++) {
        game = game.generateSuccessor(p0.getAction(game),0);
        if (game.isWin(1) || game.isLose(1)) {
          // console.log(round)
          return game.isWin(1) ? w1 : w0;
        }
        game = game.generateSuccessor(p1.getAction(game),1);
        if (game.isWin(0) || game.isLose(0)) {
          // console.log(round)
          return game.isWin(0) ? w0 : w1;
        }
      }
    }
    return w0;
  }

  survivalOfFittest(population) {
    var result = [];
    for (var i = 0; i < population.length; i += 2) {
      console.log("Matchup #", i/2)
      result[i/2] = this.simulateGame(population[i], population[i + 1]);
    }
    return result;
  }

  getDistance(w1, w2) {
    var distance = 0;
    for (var i = 0; i < this.winner.length; i++) {
      distance += (w1[i] - w2[i])*(w1[i] - w2[i]);
    }
    return distance;
  }

  naturalSelection(numGenerations) {
    for (var generation = 0; generation < numGenerations; generation++) {
      var population = [];
      for (var i = 0; i < this.popSize; i ++) population[i] = this.newWeights();
      while (population.length != 1) {
        console.log("contestants left:", population.length)
        population = this.survivalOfFittest(population);
      }
      console.log(this.getDistance(this.winner, population[0]))
      this.winner = population[0];
      console.log(this.winner)
    }
  }
}
