"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
exports.defaultState = {
    facets: {},
    facetsManager: null,
    response: null
};
exports.default = React.createContext(exports.defaultState);
