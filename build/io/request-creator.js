"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
class ElasticSearchRequest {
    constructor(options) {
        this.aggs = {};
        this.setPostFilter(options);
        this.setAggregations(options);
        this.setQuery(options);
        this.setSource(options);
        this.size = options.resultsPerPage;
        if (options.currentPage > 1)
            this.from = this.size * (options.currentPage - 1);
        if (options.sortOrder.size) {
            this.sort = [];
            options.sortOrder.forEach((sortDirection, facetId) => {
                this.sort.push({ [facetId]: sortDirection });
            });
            this.sort.push('_score');
        }
    }
    setPostFilter(options) {
        function toPostFilter(facet) {
            const allFacetFilters = [...facet.filters].map(key => ({ term: { [facet.id]: key } }));
            if (allFacetFilters.length === 1)
                return allFacetFilters[0];
            else if (allFacetFilters.length > 1)
                return { bool: { should: allFacetFilters } };
            return {};
        }
        function toHierarchyPostFilter(id, filters) {
            const allFacetFilters = [...filters].map((key, index) => {
                const field = index === 0 ?
                    id :
                    constants_1.getChildFieldName(id, index);
                return { term: { [field]: key } };
            });
            if (allFacetFilters.length === 1)
                return allFacetFilters[0];
            else if (allFacetFilters.length > 1)
                return { bool: { must: allFacetFilters } };
            return {};
        }
        const facetsData = Array.from(options.facetsData.values());
        const BooleanAndListPostFilters = facetsData
            .filter(facet => (constants_1.isBooleanFacet(facet) || constants_1.isListFacet(facet)) && facet.filters.size)
            .map((facet) => toPostFilter(facet));
        const HierarchyPostFilters = facetsData
            .filter(facet => constants_1.isHierarchyFacet(facet) && facet.filters.size)
            .map((facet) => toHierarchyPostFilter(facet.id, facet.filters));
        const DatePostFilters = facetsData
            .filter(constants_1.isDateFacet)
            .filter((facetData) => facetData.filters != null)
            .map((facet) => ({
            range: {
                [facet.id]: {
                    gte: new Date(facet.filters.from).toISOString(),
                    lte: facet.filters.to != null ? new Date(facet.filters.to).toISOString() : null
                }
            }
        }));
        const RangePostFilters = facetsData
            .filter(constants_1.isRangeFacet)
            .filter((facetData) => facetData.filters != null)
            .map((facet) => ({
            range: {
                [facet.id]: {
                    gte: facet.filters.from,
                    lte: facet.filters.to != null ? facet.filters.to : null
                }
            }
        }));
        const post_filters = BooleanAndListPostFilters
            .concat(DatePostFilters)
            .concat(RangePostFilters)
            .concat(HierarchyPostFilters);
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
    setAggregations(options) {
        for (const facetData of options.facetsData.values()) {
            let facetAggs;
            if (constants_1.isBooleanFacet(facetData))
                facetAggs = this.createBooleanAggregation(facetData);
            if (constants_1.isDateFacet(facetData))
                facetAggs = this.createDateHistogramAggregation(facetData);
            if (constants_1.isHierarchyFacet(facetData))
                facetAggs = this.createHierarchyAggregation(facetData);
            if (constants_1.isListFacet(facetData))
                facetAggs = this.createListAggregation(facetData);
            if (constants_1.isRangeFacet(facetData))
                facetAggs = this.createHistogramAggregation(facetData);
            if (facetAggs != null) {
                this.aggs = Object.assign(Object.assign({}, this.aggs), facetAggs);
            }
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
    addHierarchyFilter(key, filter, values) {
        const agg = {
            [key]: {
                aggs: { [key]: values },
                filter: { match_all: {} }
            }
        };
        if (filter != null) {
            agg[key].filter = { term: { [key]: filter } };
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
    tmp(facetData, filters, index = 0) {
        const field = index === 0 ? facetData.id : constants_1.getChildFieldName(facetData.id, index);
        const terms = {
            field,
            size: facetData.viewSize,
        };
        const [currentFilter, ...nextFilters] = filters;
        const aggs = filters.length > 0 ?
            this.tmp(facetData, nextFilters, ++index) :
            {};
        return this.addHierarchyFilter(field, currentFilter, { terms, aggs });
    }
    createHierarchyAggregation(facetData) {
        const aggs = this.tmp(facetData, Array.from(facetData.filters));
        const agg = Object.assign(Object.assign({}, aggs), this.addFilter(`${facetData.id}-count`, {
            cardinality: {
                field: facetData.id
            }
        }));
        return agg;
    }
    createListAggregation(facetData) {
        const terms = {
            field: facetData.id,
            size: facetData.viewSize,
        };
        if (facetData.sort != null)
            terms.order = { [facetData.sort.by]: facetData.sort.direction };
        if (facetData.query.length)
            terms.include = `.*${facetData.query}.*`;
        const agg = Object.assign(Object.assign({}, this.addFilter(facetData.id, { terms })), this.addFilter(`${facetData.id}-count`, {
            cardinality: {
                field: facetData.id
            }
        }));
        return agg;
    }
    createHistogramAggregation(facet) {
        const values = {
            histogram: {
                field: facet.id,
                interval: facet.interval,
            }
        };
        return this.addFilter(facet.id, values);
    }
    createDateHistogramAggregation(facet) {
        const values = {
            auto_date_histogram: {
                field: facet.id,
            }
        };
        return this.addFilter(facet.id, values);
    }
    setQuery(options) {
        if (!options.query.length)
            return;
        this.query = { query_string: { query: options.query } };
        this.highlight = { fields: { text: {} }, require_field_match: false };
    }
    setSource(options) {
        if (!options.resultFields.length && !options.excludeResultFields.length)
            return;
        this._source = {
            include: options.resultFields,
            exclude: options.excludeResultFields
        };
    }
}
exports.default = ElasticSearchRequest;
