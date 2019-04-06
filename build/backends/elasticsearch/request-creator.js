"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const facet_1 = require("../../models/facet");
class ElasticSearchRequest {
    constructor(facets = new Map(), query = '') {
        this.aggs = {};
        this.post_filter = {};
        this.size = 20;
        this.setAggs(facets);
        this.setPostFilter(facets);
        if (query.length) {
            this.query = { query_string: { query } };
            this.highlight = { fields: { text: {} }, require_field_match: false };
        }
    }
    createBooleanAggregation(facet) {
        const aggs = {
            [facet.field]: {
                terms: {
                    field: facet.field
                }
            },
        };
        return this.addFilter(aggs);
    }
    addFilter(aggs) {
        const req = { aggs };
        req.filter = this.post_filter;
        return req;
    }
    createListAggregation(facet) {
        const terms = {
            field: facet.field,
            size: facet.viewSize,
            order: {
                [facet.order[0]]: facet.order[1]
            },
        };
        if (facet.query.length)
            terms.include = `.*${facet.query}.*`;
        const aggs = {
            [facet.field]: { terms },
            [`${facet.field}-count`]: {
                cardinality: {
                    field: facet.field
                }
            }
        };
        return this.addFilter(aggs);
    }
    createRangeAggregation(facet) {
        const aggs = {
            [facet.field]: {
                stats: {
                    field: facet.field,
                }
            },
        };
        return this.addFilter(aggs);
    }
    createHistogramAggregation(facet) {
        return {
            date_histogram: {
                field: facet.field,
                interval: "year",
            }
        };
    }
    setAggs(facets) {
        for (const facet of facets.values()) {
            if (facet.type === facet_1.FacetType.List)
                this.aggs[facet.id] = this.createListAggregation(facet);
            else if (facet.type === facet_1.FacetType.Boolean)
                this.aggs[facet.id] = this.createBooleanAggregation(facet);
            else if (facet.type === facet_1.FacetType.Range) {
                this.aggs[facet.id] = this.createRangeAggregation(facet);
                this.aggs[`${facet.id}_histogram`] = this.createHistogramAggregation(facet);
            }
        }
    }
    setPostFilter(facets) {
        const filters = [];
        for (const facet of facets.values()) {
            if (facet.type === facet_1.FacetType.List || facet.type === facet_1.FacetType.Boolean) {
                let facetFilters;
                const allFacetFilters = [...facet.filters].map(key => ({ term: { [facet.field]: key } }));
                if (allFacetFilters.length === 1)
                    facetFilters = allFacetFilters[0];
                else if (allFacetFilters.length > 1)
                    facetFilters = { bool: { should: allFacetFilters } };
                if (facetFilters)
                    filters.push(facetFilters);
            }
            else if (facet instanceof facet_1.RangeFacet && Array.isArray(facet.filter) && facet.filter.length === 2) {
                filters.push({
                    range: {
                        [facet.field]: {
                            gte: facet.filter[0],
                            lte: facet.filter[1]
                        }
                    }
                });
            }
        }
        if (!filters.length) {
            this.post_filter = {};
        }
        else if (filters.length === 1) {
            this.post_filter = filters[0];
        }
        else if (filters.length > 1) {
            this.post_filter = {
                bool: {
                    must: filters
                }
            };
        }
    }
}
exports.default = ElasticSearchRequest;
