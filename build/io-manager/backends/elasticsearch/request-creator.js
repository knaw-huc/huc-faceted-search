"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ElasticSearchRequest {
    constructor(facets, facetsManagerQuery, size, resultFields) {
        this.size = size;
        this.aggs = {};
        this.setPostFilter(facets);
        this.setAggregations(facets);
        this.setQuery(facetsManagerQuery);
        this.setSource(resultFields);
    }
    setSource(resultFields) {
        if (resultFields == null || !resultFields.length)
            return;
        this._source = resultFields;
    }
    setQuery(query) {
        if (!query.length)
            return;
        this.query = { query_string: { query } };
        this.highlight = { fields: { text: {} }, require_field_match: false };
    }
    setAggregations(facets) {
        facets.filter(f => f.type === "boolean")
            .forEach((facet) => {
            this.aggs = Object.assign({}, this.aggs, this.createBooleanAggregation(facet));
        });
        facets.filter(f => f.type === "list")
            .forEach((facet) => {
            this.aggs = Object.assign({}, this.aggs, this.createListAggregation(facet));
        });
        facets.filter(f => f.type === "range")
            .forEach((facet) => {
            this.aggs = Object.assign({}, this.aggs, this.createHistogramAggregation(facet));
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
            .filter((facet) => Array.isArray(facet.filters) && facet.filters.length === 2)
            .map((facet) => ({
            range: {
                [facet.field]: {
                    gte: new Date(facet.filters[0]).toISOString(),
                    lte: new Date(facet.filters[1]).toISOString()
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
    addFilter(key, values) {
        const agg = {
            [key]: {
                aggs: { [key]: values },
                filter: { match_all: {} }
            }
        };
        if (this.post_filter != null) {
            agg[key].filter = this.post_filter;
        }
        return agg;
    }
    createBooleanAggregation(facet) {
        const values = {
            terms: {
                field: facet.field
            }
        };
        return this.addFilter(facet.field, values);
    }
    createListAggregation(facet) {
        const terms = {
            field: facet.field,
            size: facet.viewSize,
        };
        if (facet.query.length)
            terms.include = `.*${facet.query}.*`;
        const agg = Object.assign({}, this.addFilter(facet.field, { terms }), this.addFilter(`${facet.field}-count`, {
            cardinality: {
                field: facet.field
            }
        }));
        return agg;
    }
    createHistogramAggregation(facet) {
        const values = {
            auto_date_histogram: {
                field: facet.field,
            }
        };
        return this.addFilter(facet.field, values);
    }
}
exports.default = ElasticSearchRequest;
