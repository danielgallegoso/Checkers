class EightFactorEvolutionaryAgent {
  constructor(agent) {
    var weights = [38.772531211684345,
      42.141152922416275,
      10.945364518815374,
      -2.8981366526683674,
      -13.680551933762793,
      -5.522701844285107,
      10.925037969673637,
      0.6380088696436439];
    this.agent = new EightFactorMinimaxAgent(weights, agent, 4)
  }

  getAction(game) {
    return this.agent.getAction(game);
  }
}
