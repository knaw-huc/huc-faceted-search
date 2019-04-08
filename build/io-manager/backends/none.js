"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoneRequestCreator {
    constructor(facets, query) {
        this.facets = facets;
        this.query = query;
    }
}
exports.NoneRequestCreator = NoneRequestCreator;
class NoneResponseParser {
    constructor(response, facets) {
        this.facets = facets;
        Object.keys(facets)
            .forEach(field => {
            const facet = facets.get(field);
            facet.values = response[field].values;
            if (facet.type === "list") {
                facet.total = response[field].total;
            }
            if (facet.type === "range") {
                facet.histogramValues = response[field].histogramValues;
            }
        });
    }
}
exports.NoneResponseParser = NoneResponseParser;
