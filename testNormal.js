function randn_bm() {
    var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

var data = [];

for (var i=0; i <1000; i++) {
    data.push(randn_bm());
}
var mean=0;
var sd = 1;
for(var i=0; i < data.length; i++) {
    mean+=data[i];
}
mean = mean / data.length;
console.log(mean);
for(var i=0; i < data.length; i++) {
    sd+=(data[i]-mean)*(data[i]-mean);
}
sd = sd / data.length;
console.log(sd);