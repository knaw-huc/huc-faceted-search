"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ElasticSearchRequest {
    constructor(fields, resultFields, filters, sorts) {
        this.aggs = {};
        this.setPostFilter(fields, filters);
        this.setAggregations(fields);
        this.setSource(resultFields);
    }
    setSource(resultFields) {
        if (resultFields == null || !resultFields.length)
            return;
        this._source = resultFields;
    }
    setAggregations(facets) {
        facets.filter(f => f.datatype === "boolean")
            .forEach(facet => {
            this.aggs = Object.assign(Object.assign({}, this.aggs), this.createBooleanAggregation(facet));
        });
        facets.filter(f => f.datatype === "keyword")
            .forEach((facet) => {
            this.aggs = Object.assign(Object.assign({}, this.aggs), this.createListAggregation(facet));
        });
        facets.filter(f => f.datatype === "date")
            .forEach(facet => {
            this.aggs = Object.assign(Object.assign({}, this.aggs), this.createHistogramAggregation(facet));
        });
    }
    setPostFilter(facets, filters) {
        function toPostFilter(field, values) {
            const allFacetFilters = [...values].map(key => ({ term: { [field]: key } }));
            if (allFacetFilters.length === 1)
                return allFacetFilters[0];
            else if (allFacetFilters.length > 1)
                return { bool: { should: allFacetFilters } };
            return {};
        }
        const post_filters = facets
            .filter(facet => filters.has(facet.id))
            .map(facet => toPostFilter(facet.id, filters.get(facet.id)));
        if (post_filters.length === 1) {
            this.post_filter = post_filters[0];
        }
        else if (post_filters.length > 1) {
            this.post_filter = {
                bool: {
                    must: post_filters
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
                field: facet.id
            }
        };
        return this.addFilter(facet.id, values);
    }
    createListAggregation(facet) {
        const terms = {
            field: facet.id,
            size: facet.size,
        };
        const agg = Object.assign(Object.assign({}, this.addFilter(facet.id, { terms })), this.addFilter(`${facet.id}-count`, {
            cardinality: {
                field: facet.id
            }
        }));
        return agg;
    }
    createHistogramAggregation(facet) {
        const values = {
            auto_date_histogram: {
                field: facet.id,
            }
        };
        return this.addFilter(facet.id, values);
    }
}
exports.default = ElasticSearchRequest;
