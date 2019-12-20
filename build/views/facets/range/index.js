"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const hire_range_slider_1 = tslib_1.__importDefault(require("hire-range-slider"));
const header_1 = tslib_1.__importDefault(require("../header"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const histogram_1 = tslib_1.__importDefault(require("./histogram"));
const utils_1 = require("./utils");
const facet_1 = tslib_1.__importDefault(require("../facet"));
const Dates = styled_1.default('div') `
	color: #888;
	display: grid;
	font-size: .9em;
	grid-template-columns: 1fr auto 1fr;
	margin-top: 1em;
`;
const ActiveDates = styled_1.default('div') `
	color: #444;
	display: grid;
	font-weight: bold;
	grid-template-columns: 1fr 16px 1fr;
`;
function RangeFacetView(props) {
    console.log(props.values);
    const [[rangeMin, rangeMax], setRange] = React.useState([null, null]);
    const [fMin, fMax] = utils_1.formatRange(props.facetData, rangeMin, rangeMax);
    const minValue = props.values[0].key;
    const maxValue = props.values[props.values.length - 1].key;
    const lowerLimit = utils_1.timestampToRatio((rangeMin || minValue), props.values);
    const upperLimit = utils_1.timestampToRatio((rangeMax || maxValue), props.values);
    return (React.createElement(facet_1.default, null,
        React.createElement(header_1.default, { facetData: props.facetData }),
        React.createElement(histogram_1.default, { lowerLimit: lowerLimit, upperLimit: upperLimit, values: props.values }),
        React.createElement(hire_range_slider_1.default, { lowerLimit: lowerLimit, onChange: (data) => {
                const rangeMin = utils_1.ratioToTimestamp(data.lowerLimit, props.values);
                const rangeMax = utils_1.ratioToTimestamp(data.upperLimit, props.values);
                setRange([rangeMin, rangeMax]);
                if (data.refresh) {
                }
            }, style: {
                marginTop: '-6px',
                position: 'absolute',
            }, upperLimit: upperLimit }),
        React.createElement(Dates, null,
            React.createElement("span", null, utils_1.formatDate(props.facetData, minValue)),
            React.createElement(ActiveDates, null, rangeMin != null && rangeMax != null &&
                React.createElement(React.Fragment, null,
                    React.createElement("span", { style: { textAlign: 'right' } }, fMin),
                    React.createElement("span", { style: { textAlign: 'center' } }, "-"),
                    React.createElement("span", null, fMax))),
            React.createElement("span", { style: { textAlign: 'right' } }, utils_1.formatDate(props.facetData, maxValue)))));
}
RangeFacetView.defaultProps = {
    values: [
        { key: 0, count: 0 },
        { key: 1, count: 0 },
    ]
};
exports.default = React.memo(RangeFacetView);
