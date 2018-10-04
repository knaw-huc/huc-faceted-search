"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
class RangeManger {
    constructor() {
        this.aggregations = {};
        this.facets = {};
        this.filters = [];
    }
    addFacet(id, field) {
        this.addFacetData(id, field);
        this.addAggregation(id, field);
        this.addHistogramAggregation(`${id}_histogram`);
    }
    addFilter(field, min, max) {
        this.removeFilter(field);
        this.filters
            .push({
            range: {
                [field]: {
                    gte: min,
                    lte: max
                }
            }
        });
    }
    reset() {
        this.filters = [];
        this.aggregations = {};
    }
    updateFacets(response) {
        for (const facetId of Object.keys(this.facets)) {
            const facet = this.facets[facetId];
            if (!response.aggregations.hasOwnProperty(facetId))
                continue;
            const { min, max } = response.aggregations[facetId][facetId];
            facet.values = [min, max];
            facet.histogramValues = response.aggregations[`${facetId}_histogram`].buckets;
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
    addHistogramAggregation(id) {
        this.aggregations[id] = {
            date_histogram: {
                field: "date",
                interval: "year",
            }
        };
    }
    addFacetData(id, field) {
        this.facets[id] = {
            field,
            histogramValues: [],
            type: index_1.FacetType.Range,
            values: [null, null]
        };
    }
    removeFilter(field) {
        this.filters = this.filters
            .filter(filter => filter != null && !filter.range.hasOwnProperty(field));
    }
}
exports.default = RangeManger;
