function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

class minimaxAgent {
    constructor(evalFunc, depth) {
        this.depth = depth;
        this.evalFunc = evalFunc;
    }

    getAction(checkersState) {
        var self = this;
        var get_best_action = function (checkersState, depth, max_depth, agent, alpha_beta) { //eval function in state
            if (checkersState.isWin(agent) == true || checkersState.isLose(agent) == true) {
                return [null, checkersState.getScore()];
            }
            var legal_actions = checkersState.getLegalActions(agent);
            shuffle(legal_actions);
            var next_states = [];
            for (var i in legal_actions) {
              next_states.push(checkersState.generateSuccessor(legal_actions[i], agent));
            }
            var best_action = null;
            var best_score = null;

            if (agent == 0) { // player
                for (var i = 0; i < next_states.length; i++) {
                    var next_state = next_states[i];
                    if ((alpha_beta[1] - alpha_beta[0]) > 0) {
                        var next_score = null;
                        if (depth == max_depth) {
                            // next_score = checkersState.getScore()
                            next_score = self.evalFunc(checkersState);
                        } else {
                            next_score = get_best_action(next_state, depth, max_depth, 1, alpha_beta)[1];
                        }
                        if (i == 0) {
                            best_action = 0;
                            best_score = next_score;
                            if (best_score > alpha_beta[0]) {
                                alpha_beta = [best_score, alpha_beta[1]];
                            }
                        } else {
                            if (next_score > best_score) {
                                best_action = i;
                                best_score = next_score;
                                if (best_score > alpha_beta[0]) {
                                    alpha_beta = [best_score, alpha_beta[1]]
                                }
                            }
                        }
                    }
                }
                return [legal_actions[best_action], best_score];
            } else { //computer
                for (var i = 0; i < next_states.length; i++) {
                    var next_state = next_states[i];
                    if ((alpha_beta[1] - alpha_beta[0]) > 0) {
                        var next_score = get_best_action(next_state, depth + 1, max_depth, 0, alpha_beta)[1];
                        if (i == 0) {
                            best_action = 0;
                            best_score = next_score;
                            if (best_score < alpha_beta[1]) {
                                alpha_beta = [alpha_beta[0], best_score];
                            }
                        } else {
                            if (next_score < best_score) {
                                best_action = i;
                                best_score = next_score;
                                if (best_score < alpha_beta[1]) {
                                    alpha_beta = [alpha_beta[0], best_score];
                                }
                            }
                        }
                    }
                }
                return [legal_actions[best_action], best_score];
            }
        }
    var alpha_beta = [0 - Infinity, Infinity];
    var best_action = get_best_action(checkersState, 0, this.depth, 0, alpha_beta); //state, agent, max_depth = 4, depth, agent, alpha_beta
    return best_action[0];
    }
}
