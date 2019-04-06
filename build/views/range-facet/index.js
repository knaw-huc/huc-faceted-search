"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const hire_range_slider_1 = tslib_1.__importDefault(require("hire-range-slider"));
const facet_1 = tslib_1.__importDefault(require("../facet"));
const facet_header_1 = tslib_1.__importDefault(require("../facet-header"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const histogram_1 = tslib_1.__importDefault(require("./histogram"));
const facet_2 = require("../../models/facet");
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
class RangeFacetView extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            lowerLimit: 0,
            rangeMin: null,
            rangeMax: null,
            upperLimit: 1,
        };
    }
    componentDidMount() {
        this.props.state.facetsManager.addFacet(facet_2.FacetType.Range, this.props.field, this.props.index);
    }
    componentDidUpdate(prevProps) {
        const prevFacet = prevProps.state.facetsManager.getRangeFacet(prevProps.field);
        const facet = this.props.state.facetsManager.getRangeFacet(this.props.field);
        if (prevFacet.filter != null && facet.filter == null) {
            this.setState({
                lowerLimit: 0,
                rangeMin: null,
                rangeMax: null,
                upperLimit: 1,
            });
        }
    }
    render() {
        let min;
        let max;
        let histogramValues = [];
        const facet = this.props.state.facetsManager.getRangeFacet(this.props.field);
        if (facet == null)
            return null;
        [min, max] = facet.values;
        histogramValues = facet.histogramValues;
        return (React.createElement(facet_1.default, { style: { position: 'relative' } },
            React.createElement(facet_header_1.default, Object.assign({}, this.props)),
            React.createElement(histogram_1.default, { lowerLimit: this.state.lowerLimit, upperLimit: this.state.upperLimit, values: histogramValues }),
            React.createElement(hire_range_slider_1.default, { lowerLimit: this.state.lowerLimit, onChange: (data) => {
                    const rangeMin = Math.floor(min + (data.lowerLimit * (max - min)));
                    const rangeMax = Math.ceil(min + (data.upperLimit * (max - min)));
                    this.setState({
                        rangeMin,
                        rangeMax,
                        lowerLimit: data.lowerLimit,
                        upperLimit: data.upperLimit,
                    });
                    if (data.refresh) {
                        this.props.state.facetsManager.addFilter(this.props.field, rangeMin, rangeMax);
                    }
                }, style: {
                    marginTop: '-4px',
                    position: 'absolute',
                }, upperLimit: this.state.upperLimit }),
            React.createElement(Dates, null,
                React.createElement("span", null, this.formatNumber(min)),
                React.createElement(ActiveDates, null, this.state.rangeMin != null && this.state.rangeMax != null &&
                    React.createElement(React.Fragment, null,
                        React.createElement("span", { style: { textAlign: 'right' } }, this.formatNumber(this.state.rangeMin)),
                        React.createElement("span", { style: { textAlign: 'center' } }, "-"),
                        React.createElement("span", null, this.formatNumber(this.state.rangeMax)))),
                React.createElement("span", { style: { textAlign: 'right' } }, this.formatNumber(max)))));
    }
    formatNumber(num) {
        if (this.props.type === 'number')
            return num;
        else if (this.props.type === 'timestamp') {
            let date;
            const d = new Date(num);
            const year = d.getUTCFullYear();
            if (this.props.granularity === 'year') {
                date = isNaN(year) ? '' : year.toString();
            }
            else if (this.props.granularity === 'month') {
                date = `${year}-${d.getUTCMonth() + 1}`;
            }
            else if (this.props.granularity === 'day') {
                date = `${year}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
            }
            return date;
        }
    }
}
RangeFacetView.defaultProps = {
    granularity: 'year',
    type: 'number',
};
exports.default = RangeFacetView;
