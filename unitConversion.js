// handles (all are example of 100cm -> 1m):
// unitConversion(100)
// unitConversion(10, 2)
// unitConversion(10, 6, 10, 3) - from cm to km then to m
module.exports = function unitConversion(...args) {
    let exponent = 1;
    let base = args[0];

    let targetExponent = 1;
    let targetBase = 1;

    if (args.length >= 2) {
        [base, exponent] = args;
    }

    if (args.length >= 4) {
        [base, exponent, targetBase, targetExponent] = args;
    }

    return (number) =>
        (parseFloat(number) * Math.pow(targetBase, targetExponent)) / Math.pow(base, exponent);
}
