"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const facet_1 = require("./facet");
class ElasticSearchRequest {
    constructor(facets = {}, query = '') {
        this.aggs = {};
        this.post_filter = {};
        this.size = 20;
        this.sort = 'date';
        const facetList = Object.keys(facets).map(field => facets[field]);
        const listFacets = facetList.filter(facet => facet.type === facet_1.FacetType.List);
        const rangeFacets = facetList.filter(facet => facet.type === facet_1.FacetType.Range);
        for (const listFacet of listFacets) {
            this.aggs[listFacet.id] = this.createListAggregation(listFacet);
        }
        for (const rangeFacet of rangeFacets) {
            this.aggs[rangeFacet.id] = this.createRangeAggregation(rangeFacet);
            this.aggs[`${rangeFacet.id}_histogram`] = this.createHistogramAggregation(rangeFacet);
        }
        this.setPostFilter(listFacets, rangeFacets);
        if (query.length)
            this.query = { query_string: { query } };
    }
    createListAggregation(facet) {
        const terms = {
            field: facet.field,
            size: facet.viewSize,
            order: {
                [facet.order[0]]: facet.order[1]
            },
        };
        return {
            aggs: {
                [facet.field]: { terms },
                [`${facet.field}-count`]: {
                    cardinality: {
                        field: facet.field
                    }
                }
            },
            filter: {
                match_all: {}
            }
        };
    }
    createRangeAggregation(facet) {
        return {
            aggs: {
                [facet.field]: {
                    stats: {
                        field: facet.field,
                    }
                },
            },
            filter: {
                match_all: {}
            }
        };
    }
    createHistogramAggregation(facet) {
        facet.field;
        return {
            date_histogram: {
                field: "date",
                interval: "year",
            }
        };
    }
    setPostFilter(listFacets, rangeFacets) {
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
        const filters = listFilters.concat(rangeFilters);
        if (filters.length === 1) {
            this.post_filter = filters[0];
        }
        else {
            this.post_filter = {
                bool: {
                    must: filters
                }
            };
        }
    }
}
exports.default = ElasticSearchRequest;
