"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
exports.defaultState = {
    facets: {},
    facetsManager: null,
    response: null
};
exports.default = React.createContext(exports.defaultState);
