"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const button_1 = require("../../button");
function default_1(props) {
    const handleLess = React.useCallback(() => {
        props.facetsDataDispatch({ type: 'view_less', facetId: props.facetData.id });
    }, [props.facetData.id, props.values]);
    const handleMore = React.useCallback(() => {
        props.facetsDataDispatch({ type: 'view_more', facetId: props.facetData.id, total: props.values.total });
    }, [props.facetData.id, props.values.total]);
    return (React.createElement(React.Fragment, null,
        props.values.total > 0 &&
            props.values.total > props.facetData.viewSize &&
            React.createElement(button_1.MoreLessButton, { onClick: handleMore }, `View more (${props.values.total - props.facetData.viewSize})`),
        props.facetData.size < props.facetData.viewSize &&
            React.createElement(button_1.MoreLessButton, { onClick: handleLess }, "View less")));
}
exports.default = default_1;
