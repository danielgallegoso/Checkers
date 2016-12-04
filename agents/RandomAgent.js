class RandomAgent {
  getAction(game) {
    var actions = game.getLegalActions(0);
    var numActions = actions.length;
    var index = Math.floor(Math.random() * numActions)
    return actions[index];
  }
}
