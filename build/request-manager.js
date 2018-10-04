"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
class Request {
    constructor() {
        this.aggs = {};
        this.post_filter = {};
        this.size = 20;
        this.sort = 'date';
    }
}
var FacetType;
(function (FacetType) {
    FacetType[FacetType["List"] = 0] = "List";
    FacetType[FacetType["Range"] = 1] = "Range";
})(FacetType = exports.FacetType || (exports.FacetType = {}));
class RequestManager {
    constructor(url, onChange) {
        this.url = url;
        this.onChange = onChange;
        this.facets = {};
        this.cache = {};
        this.request = new Request();
        this.listFilters = [];
        this.rangeFilters = [];
    }
    addListAggregation(id, field, size) {
        this.facets[id] = {
            field,
            size,
            type: FacetType.List,
            values: []
        };
        const request = {
            aggs: {
                [field]: {
                    terms: {
                        field: field,
                        size: size
                    }
                },
                [`${field}-count`]: {
                    cardinality: {
                        field: field
                    }
                }
            },
            filter: {
                match_all: {}
            }
        };
        this.request.aggs[id] = request;
        this.dispatch();
    }
    addRangeAggregation(id, field) {
        this.facets[id] = {
            field,
            type: FacetType.Range,
            values: [null, null]
        };
        const request = {
            aggs: {
                [id]: {
                    stats: {
                        field: field,
                    }
                },
            },
            filter: {
                match_all: {}
            }
        };
        this.request.aggs[id] = request;
        this.dispatch();
    }
    addListFilter(field, key) {
        const filter = { term: { [field]: key } };
        this.listFilters.push(filter);
        this.setFilters();
    }
    addRangeFilter(field, min, max) {
        const filter = {
            range: {
                [field]: {
                    gte: min,
                    lte: max
                }
            }
        };
        this.rangeFilters.push(filter);
        this.setFilters();
    }
    addQuery(query) {
        this.request.query = { query_string: { query } };
        if (!query.length)
            delete this.request.query;
        this.dispatch();
    }
    removeListFilter(field, key) {
        this.listFilters = this.listFilters.filter(filter => !filter.term.hasOwnProperty(field) &&
            filter.term[field] !== key);
        this.setFilters();
    }
    setFacetCount(count) {
        this.facetCount = count;
        this.dispatch();
    }
    viewMoreFacetValues(id, field, size) {
        const lastResponse = JSON.parse(this.cache[JSON.stringify(this.request)]);
        const maxSize = lastResponse.aggregations[id][`${field}-count`].value;
        this.request.aggs[id].aggs[field].terms.size += size;
        if (this.request.aggs[id].aggs[field].terms.size > maxSize) {
            this.request.aggs[id].aggs[field].term.size = maxSize;
        }
        this.dispatch();
    }
    viewLessFacetValues(id, field, size) {
        this.request.aggs[id].aggs[field].terms.size -= size;
        if (this.request.aggs[id].aggs[field].terms.size < size) {
            this.request.aggs[id].aggs[field].term.size = size;
        }
        this.dispatch();
    }
    dispatch() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.facetCount == null ||
                Object.keys(this.request.aggs).length !== this.facetCount) {
                return;
            }
            const body = JSON.stringify(this.request);
            let response;
            if (this.cache.hasOwnProperty(body)) {
                response = JSON.parse(this.cache[body]);
            }
            else {
                const fetchResponse = yield fetch(this.url, {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body
                });
                response = yield fetchResponse.json();
                this.cache[body] = JSON.stringify(response);
            }
            this.updateFacets(response);
            this.onChange(response, this.facets);
        });
    }
    setFilters() {
        let post_filter;
        if (this.listFilters.length === 0) {
            post_filter = {};
        }
        else if (this.listFilters.length === 1) {
            post_filter = this.listFilters[0];
        }
        else {
            post_filter = {
                bool: {
                    should: this.listFilters
                }
            };
        }
        this.request.post_filter = post_filter;
        this.dispatch();
    }
    getValues(response, facetId, facet) {
        if (facet.type === FacetType.List) {
            let { buckets } = response.aggregations[facetId][facet.field];
            return Array.isArray(buckets) ? buckets : [];
        }
        else if (facet.type === FacetType.Range) {
            const { min, max } = response.aggregations[facetId][facetId];
            return [min, max];
        }
    }
    updateFacets(response) {
        if (response == null ||
            !response.hasOwnProperty('aggregations'))
            return;
        for (const facetId of Object.keys(this.facets)) {
            const facet = this.facets[facetId];
            if (!response.aggregations.hasOwnProperty(facetId))
                continue;
            facet.values = this.getValues(response, facetId, facet);
        }
    }
}
exports.default = RequestManager;
