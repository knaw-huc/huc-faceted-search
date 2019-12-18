"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const button_1 = require("../button");
function default_1(props) {
    return (React.createElement(React.Fragment, null,
        props.values.total > 0 &&
            props.values.total > props.facetData.viewSize &&
            React.createElement(button_1.MoreLessButton, { onClick: props.viewMore }, `View more (${props.values.total - props.facetData.viewSize})`),
        props.facetData.size < props.facetData.viewSize &&
            React.createElement(button_1.MoreLessButton, { onClick: props.viewLess }, "View less")));
}
exports.default = default_1;
