"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const button_1 = require("../button");
function default_1(props) {
    const facet = props.state.facetsManager.getListFacet(props.field);
    return (React.createElement(React.Fragment, null,
        facet.values.total > 0 &&
            facet.values.total > facet.viewSize &&
            React.createElement(button_1.MoreLessButton, { onClick: () => props.state.facetsManager.viewMore(props.field) }, `View more (${facet.values.total - facet.viewSize})`),
        facet.settings.size < facet.viewSize &&
            React.createElement(button_1.MoreLessButton, { onClick: () => props.state.facetsManager.viewLess(props.field) }, "View less")));
}
exports.default = default_1;
