const flowRight = require('lodash.flowright');
const formatNumber = require('./formatNumber.js');
const prefixWith = require('./prefixWith.js');

module.exports = function formatCurrency(x, symbol = '$') {
    const fmtFn = flowRight(prefixWith(symbol), formatNumber(1, 2));
    return fmtFn(x);
}
