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
let prevProps;
function BooleanFacet(props) {
    console.log(prevProps === props);
    for (const prop in props) {
        if (prevProps)
            console.log(prop, prevProps[prop] === props[prop]);
    }
    prevProps = props;
    return (React.createElement(facet_1.default, null,
        React.createElement(header_1.default, { facetData: props.facetData }),
        React.createElement(List, null,
            props.values.true > 0 &&
                React.createElement(value_1.default, { active: props.facetData.filters.has('true'), facetId: props.facetData.id, facetsDataDispatch: props.facetsDataDispatch, key: 'true', keyFormatter: () => props.facetData.labels.true, value: { key: 'true', count: props.values.true } }),
            props.values.false > 0 &&
                React.createElement(value_1.default, { active: props.facetData.filters.has('false'), facetId: props.facetData.id, facetsDataDispatch: props.facetsDataDispatch, key: 'false', keyFormatter: () => props.facetData.labels.false, value: { key: 'false', count: props.values.false } }))));
}
BooleanFacet.defaultProps = {
    values: { false: 0, true: 0 },
};
exports.default = React.memo(BooleanFacet);
