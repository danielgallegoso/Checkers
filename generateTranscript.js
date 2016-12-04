function generateTranscript(){
/*
    var txtFile = "transcript.txt";
    var file = new File(txtFile);
    var str = "My string of text";

    file.open("w"); // open file with write access
    file.writeln("First line of text");
    file.writeln("Second line of text " + str);
    file.write(str);
    file.close();
    */


    var input = "1. 10-14 24-19 2. 11-16 28-24 3. 7-10 32-28 4. 16-20 22-17 5. 9-13 25-22 6. 5-9 19-15 7. 10x19 24x15 1/2-1/2";
    var moves = input.split(' ');
    var map = new Object();
    map['1'] = [1,0];
    map['2'] = [3,0];
    map['3'] = [5,0];
    map['4'] = [7,0];
    map['5'] = [0,1];
    map['6'] = [2,1];
    map['7'] = [4,1];
    map['8'] = [6,1];

    map['9'] = [1,2];
    map['10'] = [3,2];
    map['11'] = [5,2];
    map['12'] = [7,2];
    map['13'] = [0,3];
    map['14'] = [2,3];
    map['15'] = [4,3];
    map['16'] = [6,3];

    map['17'] = [1,4];
    map['18'] = [3,4];
    map['19'] = [5,4];
    map['20'] = [7,4];
    map['21'] = [0,5];
    map['22'] = [2,5];
    map['23'] = [4,5];
    map['24'] = [6,5];

    map['25'] = [1,6];
    map['26'] = [3,6];
    map['27'] = [5,6];
    map['28'] = [7,6];
    map['29'] = [0,7];
    map['30'] = [2,7];
    map['31'] = [4,7];
    map['32'] = [6,7];

    console.log(moves);
    test = moves

    var game = new checkersGame();

    for (var i=0; i <moves.length - 1; i+=3) {
        agentZeroMove = moves[i+1];

        agentOneMove = moves[i+2];
    }


}

generateTranscript();