class HandpickedEndAgent {
  constructor(agent) {
    var weights = [10, 15,1, 1.5, 0,0,2,1,.5,.5,-1,-.5,.5,1];
    this.agent = new EightFactorEndMinimaxAgent(weights, agent, 4)
  }

  getAction(game) {
    return this.agent.getAction(game);
  }
}
