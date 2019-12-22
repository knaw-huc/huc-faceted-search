"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const histogram_1 = tslib_1.__importDefault(require("./histogram"));
const utils_1 = require("./utils");
utils_1.formatRange;
utils_1.ratioToTimestamp;
const Dates = styled_1.default('div') `
	color: #888;
	display: grid;
	font-size: .9em;
	grid-template-columns: 1fr auto 1fr;
	margin-top: 1em;
`;
const Date = styled_1.default.span ``;
const DateMax = styled_1.default(Date) `
	justify-self: end;
`;
const ActiveDates = styled_1.default('div') `
	color: #444;
	display: grid;
	font-weight: bold;
	grid-template-columns: 1fr 16px 1fr;
`;
function RangeFacetBody(props) {
    const minValue = props.values[0].key;
    const maxValue = utils_1.getEndDate(props.values[props.values.length - 1].key, props.facetData.interval);
    const lowerLimit = utils_1.timestampToRatio(minValue, props.values);
    const upperLimit = utils_1.timestampToRatio(maxValue, props.values);
    return (React.createElement(React.Fragment, null,
        React.createElement(histogram_1.default, { lowerLimit: lowerLimit, facetData: props.facetData, facetsDataDispatch: props.facetsDataDispatch, upperLimit: upperLimit, values: props.values }),
        React.createElement(Dates, null,
            React.createElement(Date, null, utils_1.formatDate(props.facetData, minValue)),
            React.createElement(ActiveDates, null),
            React.createElement(DateMax, null, utils_1.formatDate(props.facetData, maxValue)))));
}
exports.default = React.memo(RangeFacetBody);
