"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const values_1 = tslib_1.__importDefault(require("./values"));
const header_1 = tslib_1.__importDefault(require("../header"));
const facet_1 = tslib_1.__importDefault(require("../facet"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const FacetWrapper2 = styled_1.default(facet_1.default) `
	.child {
		margin-left: 20px;
	}
`;
function HierarchyFacet(props) {
    return (React.createElement(FacetWrapper2, null,
        React.createElement(header_1.default, { facetData: props.facetData }),
        renderNodes(props)));
}
function renderNodes(props) {
    function renderNode(values) {
        if (values == null || !values.values.length)
            return null;
        return (React.createElement(React.Fragment, null,
            React.createElement(values_1.default, { facetData: props.facetData, facetsDataDispatch: props.facetsDataDispatch, collapse: false, values: values }),
            values.values.length > 0 &&
                React.createElement("div", { className: "child" }, renderNode(values.values[0].child))));
    }
    return renderNode(props.values);
}
HierarchyFacet.defaultProps = {
    filters: new Set,
    size: 10,
    values: {
        values: [],
        total: 0
    }
};
exports.default = React.memo(HierarchyFacet);
