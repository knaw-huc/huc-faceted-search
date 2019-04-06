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
    render() {
        if (this.props.facet == null)
            return null;
        return (React.createElement("div", null,
            React.createElement(List, null, this.props.facet.values.map(value => React.createElement(value_1.default, { addFilter: () => this.props.state.facetsManager.addFilter(this.props.field, value.key), active: this.props.facet.filters.has(value.key), key: value.key, keyFormatter: (key) => this.props.labels[key], removeFilter: () => this.props.state.facetsManager.removeFilter(this.props.field, value.key), value: value })))));
    }
}
exports.default = FacetValuesView;
