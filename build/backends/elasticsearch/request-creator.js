"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const facet_1 = require("../../models/facet");
class ElasticSearchRequest {
    constructor(facets = {}, query = '') {
        this.aggs = {};
        this.post_filter = {};
        this.size = 20;
        const facetList = Object.keys(facets).map(field => facets[field]);
        const booleanFacets = facetList.filter(facet => facet.type === facet_1.FacetType.Boolean);
        const listFacets = facetList.filter(facet => facet.type === facet_1.FacetType.List);
        const rangeFacets = facetList.filter(facet => facet.type === facet_1.FacetType.Range);
        this.setPostFilter(booleanFacets, listFacets, rangeFacets);
        for (const listFacet of listFacets) {
            this.aggs[listFacet.id] = this.createListAggregation(listFacet);
        }
        for (const booleanFacet of booleanFacets) {
            this.aggs[booleanFacet.id] = this.createBooleanAggregation(booleanFacet);
        }
        for (const rangeFacet of rangeFacets) {
            this.aggs[rangeFacet.id] = this.createRangeAggregation(rangeFacet);
            this.aggs[`${rangeFacet.id}_histogram`] = this.createHistogramAggregation(rangeFacet);
        }
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
    setPostFilter(booleanFacets, listFacets, rangeFacets) {
        const booleanFilters = booleanFacets
            .filter(facet => facet.filters.size > 0)
            .map((facet) => {
            const filters = [...facet.filters].map(key => ({ term: { [facet.field]: key } }));
            if (filters.length === 1)
                return filters[0];
            else if (filters.length > 1)
                return { bool: { should: filters } };
            return {};
        });
        const listFilters = listFacets
            .filter(facet => facet.filters.size > 0)
            .map((facet) => {
            const filters = [...facet.filters].map(key => ({ term: { [facet.field]: key } }));
            if (filters.length === 1)
                return filters[0];
            else if (filters.length > 1)
                return { bool: { should: filters } };
            return {};
        });
        const rangeFilters = rangeFacets
            .filter(facet => Array.isArray(facet.filter) && facet.filter.length === 2)
            .map((facet) => ({
            range: {
                [facet.field]: {
                    gte: facet.filter[0],
                    lte: facet.filter[1]
                }
            }
        }));
        const filters = listFilters.concat(rangeFilters, booleanFilters);
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
