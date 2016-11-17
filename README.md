# checkers

state: 8x8 board represented by two nested arrays of length 8. upper left corner is (0,0).
  each tile's domain is [0, 1, 2, 3, 4]:
    0 = empty
    1 = red normal
    2 = red king
    3 = black normal
    4 = red king
    
starting state: 

actions, given a state: are of a list of all the tiles a piece goes over in one turn. The length of the list is 2 or greater, as a piece could visit multiple tiles along the course of one turn if it takes multiple pieces.
  we'll keep track of two action lists:
    optional-moves: moves that move checkers to adjacent spaces:
    must-moves: moves that take pieces. Remember, if you can take a piece, you must.

  for every checker on team:
    check northwest, northeast, southwest, southeast:
      if tile is out-of-bounds or occupied by same color piece: continue
      elif tile is empty:
        add to optional-moves
      elif tile is occupied by opposite color piece:
        check one space more northwest/northeast/southwest/southeast
        if tile is out-of-bounds or occupied by same color piece: continue:
        if tile is empty:
          add to must-moves
          update state, recursively check to see if we can continue taking pieces. all paths added to must-moves
          
   once we take a piece, we must continue taking pieces if possible.  
   if there is at least one must-move, we must take a must-move action.
   
successor state, given an action and a state:
  if the action is of length two, and the tiles are one diagonal away from eachother:
    set the second tile equal to the first tile
    set the first tile to 0
  else:
    for every two consecutive tiles in list:
      set the second tile equal to the first tile
      take the tile in between them, remove opponents piece (set to 0)
      set the first tile = 0

IsEnd(state) = true if there are no red or black pieces on all 64 tiles.
2 players: 0 = us, 1 = them
Utility(s): +∞ if we win, 0 if draw, −− if they win
Use minimax, possibly alpha-beta pruning

      

    


            
        
