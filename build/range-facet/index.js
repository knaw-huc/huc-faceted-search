"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const hire_range_slider_1 = require("hire-range-slider");
const facet_1 = require("../facet");
const facet_header_1 = require("../facet-header");
const react_emotion_1 = require("react-emotion");
const histogram_1 = require("./histogram");
const Dates = react_emotion_1.default('div') `
	color: #888;
	display: grid;
	font-size: .9em;
	grid-template-columns: 1fr auto 1fr;
	margin-top: 1em;
`;
const ActiveDates = react_emotion_1.default('div') `
	color: #444;
	display: grid;
	font-weight: bold;
	grid-template-columns: 1fr 16px 1fr;
`;
class RangeFacet extends React.PureComponent {
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
        this.props.state.ioManager.addRangeFacet(this.props.id, this.props.field);
    }
    render() {
        let min;
        let max;
        let histogramValues = [];
        const { state, id } = this.props;
        if (state.facets !== null && state.facets.hasOwnProperty(id)) {
            const facetData = state.facets[id];
            min = facetData.values[0];
            max = facetData.values[1];
            histogramValues = facetData.histogramValues;
        }
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
                        this.props.state.ioManager.addRangeFilter(this.props.field, rangeMin, rangeMax);
                        this.setState({
                            rangeMin,
                            rangeMax,
                            lowerLimit: data.lowerLimit,
                            upperLimit: data.upperLimit,
                        });
                    }
                }, style: {
                    marginTop: '-4px',
                    position: 'absolute',
                }, upperLimit: this.state.upperLimit }),
            React.createElement(Dates, null,
                React.createElement("span", null, min),
                React.createElement(ActiveDates, null, this.state.rangeMin != null && this.state.rangeMax != null &&
                    React.createElement(React.Fragment, null,
                        React.createElement("span", { style: { textAlign: 'right' } }, this.state.rangeMin),
                        React.createElement("span", { style: { textAlign: 'center' } }, "-"),
                        React.createElement("span", null, this.state.rangeMax))),
                React.createElement("span", { style: { textAlign: 'right' } }, max))));
    }
}
exports.default = RangeFacet;
