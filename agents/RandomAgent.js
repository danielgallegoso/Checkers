class RandomAgent {
  constructor(agent) {
    this.agent = agent;
  }
  getAction(game) {
    var actions = game.getLegalActions(this.agent);
    var numActions = actions.length;
    var index = Math.floor(Math.random() * numActions)
    return actions[index];
  }
}
