module.exports = function humanizeSessionDuration(ms) {
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
