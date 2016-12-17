class EightFactorEndEvolutionaryAgent {
  constructor(agent) {
    var weights = [26.3588882149776,62.05169804007839,
      7.823861336714351,
      7.877946970595879,
      0.8043990603097557,
      -6.285835915862558,
      -7.004397236139457,
      4.3283898351096495,
      1.4791722087807897,
      -3.1977215422581704,
      -2.3113625371927182,
      -5.224852895753143,
      0.5808764183966684,
      2.8696641987523694];
    this.agent = new EightFactorEndMinimaxAgent(weights, agent, 4)
  }

  getAction(game) {
    return this.agent.getAction(game);
  }
}
