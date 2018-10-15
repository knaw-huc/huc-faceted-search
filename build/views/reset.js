"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const context_1 = tslib_1.__importDefault(require("../context"));
const button_1 = tslib_1.__importDefault(require("./button"));
exports.default = () => (React.createElement(context_1.default.Consumer, null, state => React.createElement(button_1.default, { onClick: () => state.facetsManager.reset(), style: {
        fontSize: '1.2em',
        marginTop: '2em',
    } }, "Reset")));
