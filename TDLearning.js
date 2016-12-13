class TDLearning {
    constructor(g, s) {
        this.gamma = g;
        this.setSize = s;
    }

    function random() {
        var u = 1 - Math.random();
        var v = 1 - Math.random();
        return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    }

    function train(w0, w1) {
        for(var i = 0; i < w0.length; i+=1) {
            w0[i] = w0[i] + random();
        }
        for(var i = 0; i < w1.length; i+=1) {
            w1[i] = w1[i] + random();
        }

        var game = new checkersGame();

        var p0 = new SmallWeightedMinimaxAgent(w0, 0, 3);
        var p1 = new SmallWeightedMinimaxAgent(w1, 1, 3);
    }

    function objectiveFunction(oldState, reward, newState) {
        return V(oldState) - (r + this.gamma * V(newState));
    }

    function train(oldState, reward, newState, weights) {
        gradient = self.stepSize * objectiveFunction(oldState, reward, newState);
        for(var i=0; weights.length; i++) {
            weights[i] = weights[i] - gradient * 
        }
    }

    function V(state, weights) {
        for()
    }

}