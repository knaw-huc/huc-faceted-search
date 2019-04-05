"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const value_1 = tslib_1.__importDefault(require("../list-facet/value"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const List = styled_1.default('ul') `
	margin: 0;
	padding: 0;
`;
class FacetValuesView extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            values: []
        };
    }
    static getDerivedStateFromProps(props) {
        const { facets } = props.state;
        const values = (facets == null || !facets.hasOwnProperty(props.field)) ?
            [] :
            facets.get(props.field).values;
        return { values };
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(List, null, this.state.values.map(value => React.createElement(value_1.default, { addFilter: () => this.props.state.facetsManager.booleanManager.addFilter(this.props.field, value.key), active: this.props.state.facets.get(this.props.field).filters.has(value.key), key: value.key, keyFormatter: (key) => {
                    return this.props.labels[key];
                }, removeFilter: () => this.props.state.facetsManager.booleanManager.removeFilter(this.props.field, value.key), value: value })))));
    }
}
exports.default = FacetValuesView;
