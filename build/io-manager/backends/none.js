"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoneRequestCreator {
    constructor(facets, query) {
        this.facets = facets;
        this.query = query;
    }
}
exports.NoneRequestCreator = NoneRequestCreator;
function noneResponseParser(response) {
    return response;
}
exports.noneResponseParser = noneResponseParser;
