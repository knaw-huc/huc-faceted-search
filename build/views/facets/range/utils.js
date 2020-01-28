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
function formatDate(facetData, num, sameYear) {
    if (facetData.interval == null)
        return null;
    let date = '';
    const d = new Date(num);
    const year = d.getUTCFullYear();
    const interval = facetData.interval.slice(-1);
    if (interval === 'y' && !sameYear) {
        date = isNaN(year) ? '' : year.toString();
    }
    else if (interval === 'M') {
        date = `${months[d.getUTCMonth()]}`;
        if (!sameYear)
            date += ` ${year}`;
    }
    else if (interval === 'd' || interval === 'h' || interval === 's') {
        date = `${d.getUTCDate()} ${months[d.getUTCMonth()]}`;
        if (!sameYear)
            date += ` ${year}`;
    }
    return date;
}
exports.formatDate = formatDate;
