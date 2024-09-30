const flowRight = require('lodash.flowright');
const isFinite = require('lodash.isfinite');
const decimalPlaces = require('./decimalPlaces.js');
const prefixWith = require('./prefixWith.js');
const suffixWith = require('./suffixWith.js');
const unitConversion = require('./unitConversion.js');

module.exports = function formatBytes() {
    return (numberArg) => {
        const number = parseFloat(numberArg);
        if (number == 0 || !isFinite(number)) {
            return 0;
        }

        const absNumber = Math.abs(number);
        const sign = number / absNumber;

        const byteSuffixes = [' bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

        let byteIndex = Math.floor(Math.log(absNumber) / Math.log(1024));

        // cap byteIndex at array length
        byteIndex = Math.min(byteIndex, byteSuffixes.length - 1);

        return flowRight(
            prefixWith(sign < 0 ? '-' : ''),
            suffixWith(byteSuffixes[byteIndex]),
            decimalPlaces(1),
            unitConversion(1024, byteIndex)
        )(absNumber);
    };
}
