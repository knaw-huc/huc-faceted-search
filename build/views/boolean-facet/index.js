"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const value_1 = tslib_1.__importDefault(require("../list-facet/value"));
const facet_header_1 = tslib_1.__importDefault(require("../facet-header"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const List = styled_1.default('ul') `
	margin: 0;
	padding: 0;
`;
function BooleanFacet(props) {
    return (React.createElement("div", null,
        React.createElement(facet_header_1.default, { facetData: props.facetData }),
        React.createElement("div", null,
            React.createElement(List, null,
                props.values.true > 0 &&
                    React.createElement(value_1.default, { addFilter: () => props.addFilter('true'), active: props.facetData.filters.has('true'), key: 'true', keyFormatter: () => props.facetData.labels.true, removeFilter: () => props.removeFilter('true'), value: { key: 'true', count: props.values.true } }),
                props.values.false > 0 &&
                    React.createElement(value_1.default, { addFilter: () => props.addFilter('false'), active: props.facetData.filters.has('false'), key: 'false', keyFormatter: () => props.facetData.labels.false, removeFilter: () => props.removeFilter('false'), value: { key: 'false', count: props.values.false } })))));
}
BooleanFacet.defaultProps = {
    values: { false: 0, true: 0 },
};
exports.default = React.memo(BooleanFacet);
