const toFinite = require('lodash.tofinite');

module.exports = function numberWithCommas() {
    return (num) =>
        toFinite(num)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
