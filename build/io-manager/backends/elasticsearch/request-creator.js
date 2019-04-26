"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ElasticSearchRequest {
    constructor(facetsManager, size) {
        this.size = size;
        this.aggs = {};
        this.post_filter = {};
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
        facetsManager.getFacets("boolean")
            .forEach(facet => this.aggs[facet.id] = this.createBooleanAggregation(facet));
        facetsManager.getFacets("list")
            .forEach(facet => this.aggs[facet.id] = this.createListAggregation(facet));
        facetsManager.getFacets("range")
            .forEach(facet => {
            this.aggs[facet.id] = this.createRangeAggregation(facet);
            this.aggs[`${facet.id}_histogram`] = this.createHistogramAggregation(facet);
        });
    }
    setPostFilter(facetsManager) {
        function toFilter(facet) {
            const allFacetFilters = [...facet.filters].map(key => ({ term: { [facet.field]: key } }));
            if (allFacetFilters.length === 1)
                return allFacetFilters[0];
            else if (allFacetFilters.length > 1)
                return { bool: { should: allFacetFilters } };
            return {};
        }
        const booleanFilters = facetsManager.getFacets("boolean")
            .filter(facet => facet.filters.size)
            .map(toFilter);
        const listFilters = facetsManager.getFacets("list")
            .filter(facet => facet.filters.size)
            .map(toFilter);
        const rangeFilters = facetsManager.getFacets("range")
            .filter(facet => Array.isArray(facet.filter) && facet.filter.length === 2)
            .map(facet => ({
            range: {
                [facet.field]: {
                    gte: facet.filter[0],
                    lte: facet.filter[1]
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
        let histAgg = {
            date_histogram: {
                extended_bounds: { min: facet.values[0], max: facet.values[1] },
                field: facet.field,
                min_doc_count: 0,
                interval: "month",
            }
        };
        if (Object.keys(this.post_filter).length) {
            histAgg = {
                aggs: {
                    [`${facet.field}_histogram`]: {
                        date_histogram: {
                            extended_bounds: { min: facet.values[0], max: facet.values[1] },
                            field: facet.field,
                            interval: "month",
                            min_doc_count: 0,
                        }
                    }
                },
                filter: this.post_filter
            };
        }
        return histAgg;
    }
}
exports.default = ElasticSearchRequest;
