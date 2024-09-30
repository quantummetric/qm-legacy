const decimalPlaces = require('./decimalPlaces.js');
const suffixWith = require('./suffixWith.js');

module.exports = function formatNumber(precision = 1, lessThanOneThousandPrecision = 2) {
    return (numberArg) => {
        const number = parseFloat(numberArg);
        const absNumber = Math.abs(number);
        const exponent = Math.max(Math.log(absNumber) / Math.log(10), 0);

        const suffixes = ['', 'K', 'M', 'B', 'T'];
        const triplet = Math.min(Math.floor(exponent / 3), suffixes.length - 1);

        let condensedNumber;

        if (triplet > 0) {
            condensedNumber = decimalPlaces(precision)(
                number / Math.pow(10, triplet * 3)
            );
        } else {
            condensedNumber =
                number % 1 === 0
                    ? number.toString()
                    : decimalPlaces(lessThanOneThousandPrecision)(number);
        }

        return suffixWith(suffixes[triplet])(condensedNumber);
    };
}