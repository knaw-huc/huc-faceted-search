"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const request_creator_1 = tslib_1.__importDefault(require("./elasticsearch/request-creator"));
const response_parser_1 = tslib_1.__importDefault(require("./elasticsearch/response-parser"));
const none_1 = require("./none");
exports.default = {
    none: {
        RequestCreator: none_1.NoneRequestCreator,
        ResponseParser: none_1.NoneResponseParser,
    },
    elasticsearch: {
        RequestCreator: request_creator_1.default,
        ResponseParser: response_parser_1.default,
    }
};
