"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const facet_1 = require("../models/facet");
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
            if (facet.type === facet_1.FacetType.List) {
                facet.total = response[field].total;
            }
            if (facet.type === facet_1.FacetType.Range) {
                facet.histogramValues = response[field].histogramValues;
            }
        });
    }
}
exports.NoneResponseParser = NoneResponseParser;
