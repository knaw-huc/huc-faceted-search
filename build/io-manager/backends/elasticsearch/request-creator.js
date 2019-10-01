"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ElasticSearchRequest {
    constructor(facets, facetsManagerQuery, size) {
        this.size = size;
        this.aggs = {};
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
            .forEach(facet => {
            this.aggs = Object.assign({}, this.aggs, this.createBooleanAggregation(facet).aggs);
        });
        facets.filter(f => f.type === "list")
            .forEach(facet => {
            this.aggs = Object.assign({}, this.aggs, this.createListAggregation(facet).aggs);
        });
        facets.filter(f => f.type === "range")
            .forEach((facet) => {
            this.aggs = Object.assign({}, this.aggs, this.createRangeAggregation(facet).aggs, this.createHistogramAggregation(facet));
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
        const booleanFilters = facets
            .filter(f => f.type === "boolean")
            .filter((facet) => facet.filters.size)
            .map(toFilter);
        const listFilters = facets
            .filter(f => f.type === "list")
            .filter((facet) => facet.filters.size)
            .map(toFilter);
        const rangeFilters = facets
            .filter(f => f.type === "range")
            .filter((facet) => Array.isArray(facet.filter) && facet.filter.length === 2)
            .map((facet) => ({
            range: {
                [facet.field]: {
                    gte: new Date(facet.filter[0]).toISOString(),
                    lte: new Date(facet.filter[1]).toISOString()
                }
            }
        }));
        const filters = booleanFilters.concat(listFilters, rangeFilters);
        if (filters.length === 1) {
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
        if (this.post_filter != null)
            req.filter = this.post_filter;
        return req;
    }
    createBooleanAggregation(facet) {
        const agg = {
            [facet.field]: {
                terms: {
                    field: facet.field
                }
            },
        };
        return this.addFilter(agg);
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
        const listAggs = this.addFilter(agg);
        return listAggs;
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
            [facet.field]: {
                auto_date_histogram: {
                    field: facet.field,
                }
            }
        };
        return histAgg;
    }
}
exports.default = ElasticSearchRequest;
