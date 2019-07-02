"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ElasticSearchRequest {
    constructor(facets, facetsManagerQuery, size) {
        this.size = size;
        this.aggs = {};
        this.post_filter = {};
        this.setPostFilter(facets);
        this.setAggregations(facets);
        this.setQuery(facetsManagerQuery);
    }
    setQuery(query) {
        if (!query.length)
            return;
        this.query = { query_string: { query } };
        this.highlight = { fields: { text: {} }, require_field_match: false };
    }
    setAggregations(facets) {
        facets.filter(f => f.type === "boolean")
            .forEach(facet => this.aggs[facet.id] = this.createBooleanAggregation(facet));
        facets.filter(f => f.type === "list")
            .forEach(facet => this.aggs[facet.id] = this.createListAggregation(facet));
        facets.filter(f => f.type === "range")
            .forEach((facet) => {
            this.aggs[facet.id] = this.createRangeAggregation(facet);
            this.aggs[`${facet.id}_histogram`] = this.createHistogramAggregation(facet);
        });
    }
    setPostFilter(facets) {
        function toFilter(facet) {
            const allFacetFilters = [...facet.filters].map(key => ({ term: { [facet.field]: key } }));
            if (allFacetFilters.length === 1)
                return allFacetFilters[0];
            else if (allFacetFilters.length > 1)
                return { bool: { should: allFacetFilters } };
            return {};
        }
        const booleanFilters = facets.filter(f => f.type === "boolean")
            .filter((facet) => facet.filters.size)
            .map(toFilter);
        const listFilters = facets.filter(f => f.type === "list")
            .filter((facet) => facet.filters.size)
            .map(toFilter);
        const rangeFilters = facets.filter(f => f.type === "range")
            .filter((facet) => Array.isArray(facet.filter) && facet.filter.length === 2)
            .map((facet) => ({
            range: {
                [facet.field]: {
                    gte: facet.values[0],
                    lte: facet.values[1]
                }
            }
        }));
        const filters = booleanFilters.concat(listFilters, rangeFilters);
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
            min_doc_count: 0,
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
        const [min, max] = facet.values;
        let histAgg = {
            date_histogram: {
                extended_bounds: { min, max },
                field: facet.field,
                interval: "year",
                min_doc_count: 0,
            }
        };
        if (Object.keys(this.post_filter).length) {
            histAgg = {
                aggs: {
                    [`${facet.field}_histogram`]: histAgg,
                },
                filter: this.post_filter
            };
        }
        return histAgg;
    }
}
exports.default = ElasticSearchRequest;
