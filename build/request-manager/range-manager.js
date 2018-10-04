"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
class RangeManger {
    addFacet(id, field) {
        this.addFacetData(id, field);
        this.addAggregation(id, field);
    }
    addFilter(field, min, max) {
        this.filters
            .filter(filter => filter != null && !filter.range.hasOwnProperty(field))
            .push({
            range: {
                [field]: {
                    gte: min,
                    lte: max
                }
            }
        });
    }
    updateFacets(response) {
        for (const facetId of Object.keys(this.facets)) {
            const facet = this.facets[facetId];
            if (!response.aggregations.hasOwnProperty(facetId))
                continue;
            const { min, max } = response.aggregations[facetId][facetId];
            facet.values = [min, max];
        }
    }
    addAggregation(id, field) {
        this.aggregations[id] = {
            aggs: {
                [id]: {
                    stats: {
                        field: field,
                    }
                },
            },
            filter: {
                match_all: {}
            }
        };
    }
    addFacetData(id, field) {
        this.facets[id] = {
            field,
            type: index_1.FacetType.Range,
            values: [null, null]
        };
    }
}
exports.default = RangeManger;
