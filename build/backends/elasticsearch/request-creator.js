"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const facet_1 = require("../../models/facet");
class ElasticSearchRequest {
    constructor(facetsManager) {
        this.aggs = {};
        this.post_filter = {};
        this.size = 20;
        this.setAggregations(facetsManager);
        this.setQuery(facetsManager);
    }
    setQuery(facetsManager) {
        if (!facetsManager.query.length)
            return;
        this.query = { query_string: { query: facetsManager.query } };
        this.highlight = { fields: { text: {} }, require_field_match: false };
    }
    setAggregations(facetsManager) {
        this.setPostFilter(facetsManager);
        facetsManager.getFacets(facet_1.FacetType.Boolean)
            .forEach(facet => this.aggs[facet.id] = this.createBooleanAggregation(facet));
        facetsManager.getFacets(facet_1.FacetType.List)
            .forEach(facet => this.aggs[facet.id] = this.createListAggregation(facet));
        facetsManager.getFacets(facet_1.FacetType.Range)
            .forEach(facet => {
            this.aggs[facet.id] = this.createRangeAggregation(facet);
            this.aggs[`${facet.id}_histogram`] = this.createHistogramAggregation(facet);
        });
    }
    setPostFilter(facetsManager) {
        const listAndBoolFilters = facetsManager.getFacets(facet_1.FacetType.Boolean)
            .concat(facetsManager.getFacets(facet_1.FacetType.List))
            .filter(facet => facet.filters.size)
            .map(facet => {
            const allFacetFilters = [...facet.filters].map(key => ({ term: { [facet.field]: key } }));
            if (allFacetFilters.length === 1)
                return allFacetFilters[0];
            else if (allFacetFilters.length > 1)
                return { bool: { should: allFacetFilters } };
            return {};
        });
        const rangeFilters = facetsManager.getFacets(facet_1.FacetType.Range)
            .filter(facet => Array.isArray(facet.filter) && facet.filter.length === 2)
            .map(facet => ({
            range: {
                [facet.field]: {
                    gte: facet.filter[0],
                    lte: facet.filter[1]
                }
            }
        }));
        const filters = listAndBoolFilters.concat(rangeFilters);
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
    addFilter(aggs) {
        const req = { aggs };
        req.filter = this.post_filter;
        return req;
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
        const agg = {
            [facet.field]: { terms },
            [`${facet.field}-count`]: {
                cardinality: {
                    field: facet.field
                }
            }
        };
        return this.addFilter(agg);
    }
    createRangeAggregation(facet) {
        const agg = {
            [facet.field]: {
                stats: {
                    field: facet.field,
                }
            },
        };
        return this.addFilter(agg);
    }
    createHistogramAggregation(facet) {
        return {
            date_histogram: {
                field: facet.field,
                interval: "year",
            }
        };
    }
}
exports.default = ElasticSearchRequest;
