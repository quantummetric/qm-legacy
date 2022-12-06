const moment = require('moment');
const toFinite = require('lodash.tofinite');
const flowRight = require('lodash.flowright');
const isFinite = require('lodash.isfinite');

let warnedAboutFormatDuration = false;

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

module.exports = class Display {
    static default() {
        return (x) => x;
    }

    static prefixWith(prefix) {
        return (x) => `${prefix}${x}`;
    }

    static suffixWith(suffix) {
        return (x) => `${x}${suffix}`;
    }

    static decimalPlaces(digits) {
        return (numberArg) => {
            const number = parseFloat(numberArg);
            const multiplyBy = Math.pow(10, digits);
            return (Math.round(number * multiplyBy) / multiplyBy).toFixed(digits);
        };
    }

    static numberWithCommas() {
        return (num) =>
            toFinite(num)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    static formatNumber(precision = 1, lessThanOneThousandPrecision = 2) {
        return (numberArg) => {
            const number = parseFloat(numberArg);
            const absNumber = Math.abs(number);
            const exponent = Math.max(Math.log(absNumber) / Math.log(10), 0);

            const suffixes = ['', 'K', 'M', 'B', 'T'];
            const triplet = Math.min(Math.floor(exponent / 3), suffixes.length - 1);

            let condensedNumber;

            if (triplet > 0) {
                condensedNumber = Display.decimalPlaces(precision)(
                    number / Math.pow(10, triplet * 3)
                );
            } else {
                condensedNumber =
                    number % 1 === 0
                        ? number.toString()
                        : Display.decimalPlaces(lessThanOneThousandPrecision)(number);
            }

            return Display.suffixWith(suffixes[triplet])(condensedNumber);
        };
    }

    static formatCurrency(x, symbol = '$') {
        const fmtFn = flowRight(Display.prefixWith(symbol), Display.formatNumber(1, 2));
        return fmtFn(x);
    }

    static formatDuration(
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
                    ? `${Display.formatNumber(1, 2)(elapsed.asSeconds())}s`
                    : date.format('s[s]');
            } else if (elapsed.asMilliseconds() >= 1) {
                formattedDuration = `${Display.formatNumber(1, 2)(elapsed.asSeconds())}s`;
            }

            return formattedDuration;
        };
    }

    // handles (all are example of 100cm -> 1m):
    // unitConversion(100)
    // unitConversion(10, 2)
    // unitConversion(10, 6, 10, 3) - from cm to km then to m
    static unitConversion(...args) {
        let exponent = 1;
        let base = args[0];

        let targetExponent = 1;
        let targetBase = 1;

        if (args.length >= 2) {
            [base, exponent] = args;
        }

        if (args.length >= 4) {
            [base, exponent, targetBase, targetExponent] = args;
        }

        return (number) =>
            (parseFloat(number) * Math.pow(targetBase, targetExponent)) / Math.pow(base, exponent);
    }

    static formatBytes() {
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
                Display.prefixWith(sign < 0 ? '-' : ''),
                Display.suffixWith(byteSuffixes[byteIndex]),
                Display.decimalPlaces(1),
                Display.unitConversion(1024, byteIndex)
            )(absNumber);
        };
    }

    static coerceRealNumber() {
        return function _coerceRealNumber(value) {
            return Number.isFinite(value) && !Number.isNaN(value) ? value : 0;
        };
    }

    // Assumes the duration you're passing in is a quantity of milliseconds
    static humanizeDuration(useAbbreviation, decimalPlaces) {
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
            const count = Display.formatNumber(
                1,
                decimalPlaces
            )(moment.duration(ms).as(_threshold));
            const unit = count > 1 && !useAbbreviation ? `${threshold}s` : threshold; // abbreviations don't normally have plural suffixes, so just use threshold if abbreviating

            return `${count} ${unit}`;
        };
    }

    static humanizeSessionDuration(ms) {
        const differenceInMinutes = Math.floor((Date.now() - ms) / 60000);
        if (differenceInMinutes < 1) {
            return `< 1 min ago`;
        }
        if (differenceInMinutes < 120) {
            return `${differenceInMinutes} ${differenceInMinutes > 1 ? 'minutes' : 'minute'} ago`;
        }
        if (differenceInMinutes < 2880) {
            const differenceInHours = Math.floor(differenceInMinutes / 60);
            return `${differenceInHours} hours ago`;
        }
        const differenceInHours = Math.floor(differenceInMinutes / 1440);
        return `${differenceInHours} ${differenceInHours > 1 ? 'days' : 'day'} ago`;
    }
};
