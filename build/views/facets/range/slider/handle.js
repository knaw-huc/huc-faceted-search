"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const index_1 = require("./index");
exports.default = (props) => {
    return React.createElement("circle", { cx: (props.radius + props.strokeWidth / 2) + (props.percentage * index_1.VIEW_BOX_WIDTH), cy: props.radius + props.strokeWidth / 2, fill: "white", onMouseDown: props.onMouseDown, onTouchStart: props.onTouchStart, r: props.radius, stroke: "gray", strokeWidth: props.strokeWidth });
};
