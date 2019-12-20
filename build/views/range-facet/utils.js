"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function ratioToTimestamp(ratio, values) {
    const minValue = values[0].key;
    const maxValue = values[values.length - 1].key;
    return Math.floor(minValue + (ratio * (maxValue - minValue)));
}
exports.ratioToTimestamp = ratioToTimestamp;
function timestampToRatio(timestamp, values) {
    const minValue = values[0].key;
    const maxValue = values[values.length - 1].key;
    return (timestamp - minValue) / (maxValue - minValue);
}
exports.timestampToRatio = timestampToRatio;
function formatRange(facetData, rangeMin, rangeMax) {
    if (facetData.type === 'number')
        return [rangeMin, rangeMax];
    const dateMin = new Date(rangeMin);
    const yearMin = dateMin.getUTCFullYear();
    const dateMax = new Date(rangeMax);
    const yearMax = dateMax.getUTCFullYear();
    return [formatDate(facetData, rangeMin, yearMin === yearMax), formatDate(facetData, rangeMax)];
}
exports.formatRange = formatRange;
function formatDate(facetData, num, sameYear) {
    if (facetData.type === 'number')
        return num;
    let date = '';
    const d = new Date(num);
    const year = d.getUTCFullYear();
    if (facetData.interval === 'year' && !sameYear) {
        date = isNaN(year) ? '' : year.toString();
    }
    else if (facetData.interval === 'month') {
        date = `${months[d.getUTCMonth()]}`;
        if (!sameYear)
            date += ` ${year}`;
    }
    else if (facetData.interval === 'day') {
        date = `${d.getUTCDate()} ${months[d.getUTCMonth()]}`;
        if (!sameYear)
            date += ` ${year}`;
    }
    return date;
}
exports.formatDate = formatDate;
