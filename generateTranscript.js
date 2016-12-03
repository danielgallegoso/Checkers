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
    map['3'] = [3,0];
    map['4'] = [5,0];
    map['5'] = [7,0];
    console.log(map);





}

generateTranscript();