"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
var SortBy;
(function (SortBy) {
    SortBy["Count"] = "_count";
    SortBy["Key"] = "_term";
})(SortBy = exports.SortBy || (exports.SortBy = {}));
var SortDirection;
(function (SortDirection) {
    SortDirection["Asc"] = "asc";
    SortDirection["Desc"] = "desc";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
class ListManager {
    constructor() {
        this.aggregations = {};
        this.facets = {};
        this.filters = [];
    }
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
    reset() {
        this.filters = [];
        Object.keys(this.facets).map(id => {
            const facet = this.facets[id];
            this.addAggregation(id, facet.field, facet.size);
        });
    }
    addQuery(id, field, query) {
        const { terms } = this.aggregations[id].aggs[field];
        if (!query || !query.length)
            delete terms.include;
        terms.include = `.*${query}.*`;
    }
    sortBy(id, field, sortBy, direction) {
        const { terms } = this.aggregations[id].aggs[field];
        terms.order = {
            [sortBy]: direction
        };
        console.log(terms.order);
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
exports.default = ListManager;
