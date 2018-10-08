"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elastic_search_request_1 = require("../models/elastic-search-request");
const elastic_search_response_parser_1 = require("../models/elastic-search-response-parser");
const none_1 = require("./none");
exports.default = {
    none: {
        RequestCreator: none_1.NoneRequestCreator,
        ResponseParser: none_1.NoneResponseParser,
    },
    elasticsearch: {
        RequestCreator: elastic_search_request_1.default,
        ResponseParser: elastic_search_response_parser_1.default,
    }
};
