"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const range_manager_1 = require("./range-manager");
const list_manager_1 = require("./list-manager");
class Request {
    constructor() {
        this.aggs = {};
        this.post_filter = {};
        this.size = 20;
        this.sort = 'date';
    }
}
exports.Request = Request;
var FacetType;
(function (FacetType) {
    FacetType[FacetType["List"] = 0] = "List";
    FacetType[FacetType["Range"] = 1] = "Range";
})(FacetType = exports.FacetType || (exports.FacetType = {}));
class IOManager {
    constructor(url, onChange) {
        this.url = url;
        this.onChange = onChange;
        this.cache = {};
        this.rangeManager = new range_manager_1.default();
        this.listManager = new list_manager_1.default();
        this.request = new Request();
    }
    addListAggregation(id, field, size) {
        this.listManager.addFacet(id, field, size);
        this.dispatch();
    }
    addListAggregationQuery(id, field, query) {
        this.listManager.addQuery(id, field, query);
        this.dispatch();
    }
    addListFilter(field, key) {
        this.listManager.addFilter(field, key);
        this.setFilters();
    }
    removeListFilter(field, key) {
        this.listManager.removeFilter(field, key);
        this.setFilters();
    }
    sortListBy(id, field, sortBy, direction) {
        this.listManager.sortBy(id, field, sortBy, direction);
        this.dispatch();
    }
    addRangeFacet(id, field) {
        this.rangeManager.addFacet(id, field);
        this.dispatch();
    }
    addRangeFilter(field, min, max) {
        this.rangeManager.addFilter(field, min, max);
        this.setFilters();
    }
    addQuery(query) {
        this.request.query = { query_string: { query } };
        if (!query.length)
            delete this.request.query;
        this.dispatch();
    }
    reset() {
        this.request = new Request();
        this.listManager.reset();
        this.rangeManager.reset();
        this.dispatch();
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
            this.request.aggs = Object.assign({}, this.listManager.aggregations, this.rangeManager.aggregations);
            const facets = Object.assign({}, this.listManager.facets, this.rangeManager.facets);
            if (this.facetCount == null ||
                Object.keys(facets).length !== this.facetCount) {
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
                if (response == null ||
                    !response.hasOwnProperty('aggregations'))
                    return;
                this.cache[body] = JSON.stringify(response);
            }
            this.listManager.updateFacets(response);
            this.rangeManager.updateFacets(response);
            this.onChange(response, facets);
        });
    }
    prepareFilters(manager) {
        let filters;
        if (manager.filters.length === 0) {
            filters = {};
        }
        else if (manager.filters.length === 1) {
            filters = manager.filters[0];
        }
        else {
            filters = {
                bool: {
                    should: manager.filters
                }
            };
        }
        return filters;
    }
    setFilters() {
        let listFilters = this.prepareFilters(this.listManager);
        let rangeFilters = this.prepareFilters(this.rangeManager);
        let post_filter;
        if (this.listManager.filters.length && this.rangeManager.filters.length) {
            post_filter = {
                bool: {
                    must: [rangeFilters].concat(listFilters)
                }
            };
        }
        else if (this.listManager.filters.length && !this.rangeManager.filters.length) {
            post_filter = listFilters;
        }
        else if (!this.listManager.filters.length && this.rangeManager.filters.length) {
            post_filter = rangeFilters;
        }
        this.request.post_filter = post_filter;
        this.dispatch();
    }
}
exports.default = IOManager;
