"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const context_1 = require("../context");
const button_1 = require("./button");
exports.default = () => (React.createElement(context_1.default.Consumer, null, state => React.createElement(button_1.default, { onClick: () => state.ioManager.reset(), style: {
        fontSize: '1.2em',
        marginTop: '2em',
    } }, "Reset")));
