"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const header_1 = tslib_1.__importDefault(require("../header"));
const facet_1 = tslib_1.__importDefault(require("../facet"));
const body_1 = tslib_1.__importDefault(require("./body"));
function DateFacetView(props) {
    return (React.createElement(facet_1.default, null,
        React.createElement(header_1.default, { facetData: props.facetData }),
        props.values.values.length > 0 &&
            React.createElement(body_1.default, Object.assign({}, props))));
}
DateFacetView.defaultProps = {
    values: []
};
exports.default = React.memo(DateFacetView);
