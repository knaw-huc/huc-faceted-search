"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const hire_range_slider_1 = tslib_1.__importDefault(require("hire-range-slider"));
const facet_1 = tslib_1.__importDefault(require("../facet"));
const facet_header_1 = tslib_1.__importDefault(require("../facet-header"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const histogram_1 = tslib_1.__importDefault(require("./histogram"));
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
function ratioToTimestamp(ratio, facet) {
    const minValue = facet.values[0].key;
    const maxValue = facet.values[facet.values.length - 1].key;
    return Math.floor(minValue + (ratio * (maxValue - minValue)));
}
exports.ratioToTimestamp = ratioToTimestamp;
function timestampToRatio(timestamp, facet) {
    const minValue = facet.values[0].key;
    const maxValue = facet.values[facet.values.length - 1].key;
    return (timestamp - minValue) / (maxValue - minValue);
}
exports.timestampToRatio = timestampToRatio;
class RangeFacetView extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            rangeMin: null,
            rangeMax: null,
        };
    }
    componentDidMount() {
        this.props.state.facetsManager.setRangeFacet(this.props.field, this.props.index, {
            interval: this.props.interval
        });
    }
    componentDidUpdate(prevProps) {
        const prevFacet = prevProps.state.facetsManager.getRangeFacet(prevProps.field);
        const facet = this.props.state.facetsManager.getRangeFacet(this.props.field);
        if (prevFacet.filter != null && facet.filter == null) {
            this.setState({
                rangeMin: null,
                rangeMax: null,
            });
        }
        else if (Array.isArray(facet.filter) && facet.filter.length === 2) {
            this.setState({
                rangeMin: facet.filter[0],
                rangeMax: facet.filter[1],
            });
        }
    }
    render() {
        const facet = this.props.state.facetsManager.getRangeFacet(this.props.field);
        if (facet == null)
            return null;
        const [fMin, fMax] = this.formatRange();
        const minValue = facet.values[0].key;
        const maxValue = facet.values[facet.values.length - 1].key;
        const lowerLimit = timestampToRatio(this.state.rangeMin || minValue, facet);
        const upperLimit = timestampToRatio(this.state.rangeMax || maxValue, facet);
        return (React.createElement(facet_1.default, { style: { position: 'relative' } },
            React.createElement(facet_header_1.default, Object.assign({}, this.props)),
            React.createElement(histogram_1.default, { lowerLimit: lowerLimit, upperLimit: upperLimit, values: facet.values }),
            React.createElement(hire_range_slider_1.default, { lowerLimit: lowerLimit, onChange: (data) => {
                    const rangeMin = ratioToTimestamp(data.lowerLimit, facet);
                    const rangeMax = ratioToTimestamp(data.upperLimit, facet);
                    this.setState({ rangeMin, rangeMax });
                    if (data.refresh) {
                        this.props.state.facetsManager.addFilter(this.props.field, rangeMin, rangeMax);
                    }
                }, style: {
                    marginTop: '-6px',
                    position: 'absolute',
                }, upperLimit: upperLimit }),
            React.createElement(Dates, null,
                React.createElement("span", null, this.formatDate(minValue)),
                React.createElement(ActiveDates, null, this.state.rangeMin != null && this.state.rangeMax != null &&
                    React.createElement(React.Fragment, null,
                        React.createElement("span", { style: { textAlign: 'right' } }, fMin),
                        React.createElement("span", { style: { textAlign: 'center' } }, "-"),
                        React.createElement("span", null, fMax))),
                React.createElement("span", { style: { textAlign: 'right' } }, this.formatDate(maxValue)))));
    }
    formatRange() {
        if (this.props.type === 'number')
            return [this.state.rangeMin, this.state.rangeMax];
        const dateMin = new Date(this.state.rangeMin);
        const yearMin = dateMin.getUTCFullYear();
        const dateMax = new Date(this.state.rangeMax);
        const yearMax = dateMax.getUTCFullYear();
        return [this.formatDate(this.state.rangeMin, yearMin === yearMax), this.formatDate(this.state.rangeMax)];
    }
    formatDate(num, sameYear) {
        if (this.props.type === 'number')
            return num;
        let date = '';
        const d = new Date(num);
        const year = d.getUTCFullYear();
        if (this.props.interval === 'year' && !sameYear) {
            date = isNaN(year) ? '' : year.toString();
        }
        else if (this.props.interval === 'month') {
            date = `${months[d.getUTCMonth()]}`;
            if (!sameYear)
                date += ` ${year}`;
        }
        else if (this.props.interval === 'day') {
            date = `${d.getUTCDate()} ${months[d.getUTCMonth()]}`;
            if (!sameYear)
                date += ` ${year}`;
        }
        return date;
    }
}
RangeFacetView.defaultProps = {
    interval: 'year',
    type: 'number',
};
exports.default = RangeFacetView;
