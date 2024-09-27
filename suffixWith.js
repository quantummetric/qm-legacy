module.exports = function suffixWith(suffix) {
    return (x) => `${x}${suffix}`;
}