"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function getEndDate(timestamp, interval) {
    if (interval == null)
        return null;
    const date = new Date(timestamp);
    const count = parseInt(interval.slice(0, -1));
    const intervalChar = interval.slice(-1);
    const yearMultiplier = intervalChar === 'y' ? count : 0;
    const monthMultiplier = intervalChar === 'M' ? count : 0;
    const dateMultiplier = (intervalChar === 'd' || intervalChar === 'h' || intervalChar === 's') ? count : 0;
    const nextYear = date.getUTCFullYear() + yearMultiplier;
    const nextMonth = date.getUTCMonth() + monthMultiplier;
    const nextDate = date.getUTCDate() + dateMultiplier;
    return new Date(nextYear, nextMonth, nextDate).getTime();
}
exports.getEndDate = getEndDate;
function formatDate(timestamp, interval, sameYear) {
    if (interval == null)
        return null;
    let date = '';
    const d = new Date(timestamp);
    const year = d.getUTCFullYear();
    const intervalType = interval.slice(-1);
    if (intervalType === 'y' && !sameYear) {
        date = isNaN(year) ? '' : year.toString();
    }
    else if (intervalType === 'M') {
        date = `${months[d.getUTCMonth()]}`;
        if (!sameYear)
            date += ` ${year}`;
    }
    else if (intervalType === 'd' || intervalType === 'h' || intervalType === 's') {
        date = `${d.getUTCDate()} ${months[d.getUTCMonth()]}`;
        if (!sameYear)
            date += ` ${year}`;
    }
    return date;
}
exports.formatDate = formatDate;
