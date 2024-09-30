const moment = require('moment-timezone');
const formatNumber = require('./formatNumber.js');

const abbreviations = {
    millisecond: 'ms',
    second: 's',
    minute: 'min',
    hour: 'hr',
    day: 'd',
    week: 'wk',
    month: 'mo',
    year: 'yr',
};

const abbreviateUnit = (unit) => abbreviations[unit] || unit;

// Assumes the duration you're passing in is a quantity of milliseconds
module.exports = function humanizeDuration(useAbbreviation, decimalPlaces) {
    useAbbreviation = useAbbreviation || false;
    decimalPlaces = decimalPlaces === 0 ? 0 : decimalPlaces || 1;
    const thresholds = {
        millisecond: 1000,
        second: moment.duration(60, 'second').as('milliseconds'),
        minute: moment.duration(60, 'minute').as('milliseconds'),
        hour: moment.duration(24, 'hour').as('milliseconds'),
        day: moment.duration(7, 'day').as('milliseconds'),
        week: moment.duration(4, 'week').as('milliseconds'),
        month: moment.duration(12, 'month').as('milliseconds'),
        year: moment.duration(1, 'year').as('milliseconds'),
    };

    return (ms) => {
        let result = Object.entries(thresholds).find(([, v]) => ms < v);

        // If no result, it's greater than 1yr
        if (!result) {
            result = ['year'];
        }

        const [_threshold] = result;
        const threshold = useAbbreviation ? abbreviateUnit(_threshold) : _threshold;
        const count = formatNumber(
            1,
            decimalPlaces
        )(moment.duration(ms).as(_threshold));
        const unit = count > 1 && !useAbbreviation ? `${threshold}s` : threshold; // abbreviations don't normally have plural suffixes, so just use threshold if abbreviating

        return `${count} ${unit}`;
    };
}