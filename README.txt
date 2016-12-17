README:

To play a game of checkers, open Checkers.html. 

The src folder contains all of the react code used to make the checkers web app. 

CheckersGame contains all of the logic around a checkers game. It stores state information, and generates next actions. 

All agents can be found in the agent folder. The agents are heavily decomposed so they have very little code. In most cases they use minimax.js, and store their custom weights.

TDLearning.js was used to learn weights with TD Learning.

Train.js was used for the evolutionary algorithm. 

Test.js tested agents against grandmasters

SimulateGame.js played agents against each other.

FastFactors.js was used to generate features.

generateTranscript.js was used to scrape data from past Checkers World Championship transcripts 