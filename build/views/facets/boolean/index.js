"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const value_1 = tslib_1.__importDefault(require("../list/value"));
const header_1 = tslib_1.__importDefault(require("../header"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const facet_1 = tslib_1.__importDefault(require("../facet"));
const List = styled_1.default('ul') `
	margin: 0;
	padding: 0;
`;
function BooleanFacet(props) {
    return (React.createElement(facet_1.default, null,
        React.createElement(header_1.default, { facetData: props.facetData }),
        React.createElement(List, null, props.values
            .filter(v => v.count > 0)
            .map(value => React.createElement(value_1.default, { active: props.facetData.filters.has(value.key), facetId: props.facetData.id, facetsDataDispatch: props.facetsDataDispatch, key: value.key, value: value })))));
}
BooleanFacet.defaultProps = {
    values: []
};
exports.default = React.memo(BooleanFacet);
