"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const button_1 = tslib_1.__importDefault(require("./button"));
exports.default = (props) => (React.createElement(button_1.default, { onClick: props.onClick, style: {
        fontSize: '1.2em',
        marginTop: '2em',
    } }, "Reset"));
