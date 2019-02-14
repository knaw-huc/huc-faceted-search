"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const button_1 = require("../button");
function default_1(props) {
    if (!props.state.facets.hasOwnProperty(props.field))
        return null;
    const facet = props.state.facets[props.field];
    return (React.createElement(React.Fragment, null,
        facet.total > 0 &&
            facet.total > facet.viewSize &&
            React.createElement(button_1.MoreLessButton, { onClick: () => props.state.facetsManager.listManager.viewMore(props.field) }, `View more (${facet.total - facet.viewSize})`),
        facet.size < facet.viewSize &&
            React.createElement(button_1.MoreLessButton, { onClick: () => props.state.facetsManager.listManager.viewLess(props.field) }, "View less")));
}
exports.default = default_1;
