module.exports = function prefixWith(prefix) {
    return (x) => `${prefix}${x}`;
}
