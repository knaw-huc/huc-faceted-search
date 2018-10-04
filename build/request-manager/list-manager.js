"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
class ListManger {
    addFacet(id, field, size) {
        this.addFacetData(id, field, size);
        this.addAggregation(id, field, size);
    }
    addFilter(field, key) {
        this.filters.push({ term: { [field]: key } });
    }
    removeFilter(field, key) {
        this.filters = this.filters.filter(filter => !filter.term.hasOwnProperty(field) &&
            filter.term[field] !== key);
    }
    updateFacets(response) {
        for (const facetId of Object.keys(this.facets)) {
            const facet = this.facets[facetId];
            if (!response.aggregations.hasOwnProperty(facetId))
                continue;
            let { buckets } = response.aggregations[facetId][facet.field];
            facet.values = Array.isArray(buckets) ? buckets : [];
        }
    }
    addAggregation(id, field, size) {
        this.aggregations[id] = {
            aggs: {
                [field]: {
                    terms: {
                        field: field,
                        size: size
                    }
                },
                [`${field}-count`]: {
                    cardinality: {
                        field: field
                    }
                }
            },
            filter: {
                match_all: {}
            }
        };
    }
    addFacetData(id, field, size) {
        this.facets[id] = {
            field,
            size,
            type: index_1.FacetType.List,
            values: []
        };
    }
}
exports.default = ListManger;
