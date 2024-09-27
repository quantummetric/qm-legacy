module.exports = function coerceRealNumber() {
    return function _coerceRealNumber(value) {
        return Number.isFinite(value) && !Number.isNaN(value) ? value : 0;
    };
}
