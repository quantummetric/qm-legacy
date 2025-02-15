const moment = require('moment-timezone');
const formatNumber = require('./formatNumber.js');

let warnedAboutFormatDuration = false;

module.exports = function formatDuration(
    forceMinutes = false,
    customFormat = null,
    forceMilliseconds = false,
    highResSeconds = false
) {
    return (millisecondArg) => {
        if (!warnedAboutFormatDuration) {
            console.warn(
                '"formatDuration" is flawed as it formats a date not a quantity of time! Check your implementation to ensure this is what you want. If not you should use "humanizeDuration"'
            );
            warnedAboutFormatDuration = true;
        }
        let formattedDuration = '0s';
        const milliseconds = parseFloat(millisecondArg);
        const date = moment().startOf('year').milliseconds(parseInt(milliseconds));
        const elapsed = moment.duration(milliseconds);

        if (customFormat) {
            formattedDuration = date.format(customFormat);
        } else if (elapsed.asHours() >= 1) {
            formattedDuration = date.format('h[h] mm[m]');
        } else if (elapsed.asMinutes() >= 1) {
            formattedDuration = date.format('m[m]');
        } else if (forceMilliseconds) {
            formattedDuration = date.format(
                `${milliseconds > 9999 ? 's' : ''}${milliseconds > 999 ? 's,' : ''}SSS[ms]`
            );
        } else if (forceMinutes) {
            formattedDuration =
                date.format('m') + '.' + Math.round((10 * elapsed.format('ss')) / 60) + 'm';
        } else if (elapsed.asSeconds() >= 1) {
            formattedDuration = highResSeconds
                ? `${formatNumber(1, 2)(elapsed.asSeconds())}s`
                : date.format('s[s]');
        } else if (elapsed.asMilliseconds() >= 1) {
            formattedDuration = `${formatNumber(1, 2)(elapsed.asSeconds())}s`;
        }

        return formattedDuration;
    };
}
