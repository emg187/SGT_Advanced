function doMath(num1, num2, operation){
    var result;
    
    if (operation==="+"){
        result = num1+num2;
    } else if (operation==="-"){
        result = num1-num2;
    } else if (operation==="x" || operation==="X" || operation==="*"){
        result = num1*num2;
    } else {
        result = num1/num2;
    }
    return result;
}
var n1 = parseInt(process.argv[2]);
var op = process.argv[3];
var n2 = parseInt(process.argv[4]);

var answer = doMath(n1, n2, op);
console.log(answer);

