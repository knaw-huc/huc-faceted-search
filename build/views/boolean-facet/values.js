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
class BooleanFacetValuesView extends React.PureComponent {
    render() {
        if (this.props.facet == null)
            return null;
        const { true: trueCount, false: falseCount } = this.props.facet.values;
        return (React.createElement("div", null,
            React.createElement(List, null,
                React.createElement(value_1.default, { addFilter: () => this.props.state.facetsManager.addFilter(this.props.field, 'true'), active: this.props.facet.filters.has('true'), key: 'true', keyFormatter: () => this.props.labels.true, removeFilter: () => this.props.state.facetsManager.removeFilter(this.props.field, 'true'), value: { key: 'true', count: trueCount } }),
                React.createElement(value_1.default, { addFilter: () => this.props.state.facetsManager.addFilter(this.props.field, 'false'), active: this.props.facet.filters.has('false'), key: 'false', keyFormatter: () => this.props.labels.false, removeFilter: () => this.props.state.facetsManager.removeFilter(this.props.field, 'false'), value: { key: 'false', count: falseCount } }))));
    }
}
exports.default = BooleanFacetValuesView;
