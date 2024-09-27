module.exports = function decimalPlaces(digits) {
    return (numberArg) => {
        const number = parseFloat(numberArg);
        const multiplyBy = Math.pow(10, digits);
        return (Math.round(number * multiplyBy) / multiplyBy).toFixed(digits);
    };
}