function ComplexNumber(real,imaginary) {
    this.r = real;
    this.i = imaginary;
    this.magnitude = Math.sqrt(this.r*this.r + this.i*this.i);
}

ComplexNumber.prototype.toString = function() {
    return ("{" + this.r + " , " + this.i + "i)");
}

ComplexNumber.prototype.plus = function(C) {
    if (isNaN(C) && !(C instanceof ComplexNumber)) {
        console.log("bad arrgument.");
        return;
    }
    if (!(C instanceof ComplexNumber)) {
        console.log("Argument not complex, so val = r  and i = 0.");
        return new ComplexNumber((C + this.r), 0);
    }
    // C must be a ComplexNUmber, so proceed....
    return new ComoplexNumber((this.r + C.r),(this.i + C.i));                   
}

ComplexNumber.prototype.squared = function() {
    return new ComplexNumber(this.r*this.r - this.i*this.i, 2*this.r*this.i);
}

var testNumber = new ComplexNumber(2,4);
var otherTester = new ComplexNumber(-1,3);
console.log(testNumber.squared());
console.log(testNumber.squared().magnitude);
console.log(testNumber.toString());
console.log(testNumber.magnitude);