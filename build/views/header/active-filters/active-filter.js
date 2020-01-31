"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
function ActiveFilter(props) {
    return (React.createElement(React.Fragment, null, props.filter.values.map(value => React.createElement("li", { key: value, onClick: () => {
            props.dispatch({ type: 'remove_filter', facetId: props.filter.id, value });
        }, title: `${props.filter.title}: ${value}` }, value))));
}
exports.default = React.memo(ActiveFilter);
