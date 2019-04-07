"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
exports.defaultState = {
    cycle: 0,
    facetsManager: null,
};
exports.default = React.createContext(exports.defaultState);
