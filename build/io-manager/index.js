"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const range_manager_1 = require("./range-manager");
const list_manager_1 = require("./list-manager");
const elastic_search_request_1 = require("../models/elastic-search-request");
const elastic_search_response_parser_1 = require("../models/elastic-search-response-parser");
class IOManager {
    constructor(url, onChange) {
        this.url = url;
        this.onChange = onChange;
        this.cache = {};
        this.rangeManager = new range_manager_1.default();
        this.listManager = new list_manager_1.default();
        this.query = '';
    }
    addListAggregation(field, index, size) {
        this.listManager.addFacet(field, index, size);
        this.dispatch();
    }
    addListAggregationQuery(field, query) {
        this.listManager.addQuery(field, query);
        this.dispatch();
    }
    addListFilter(field, key) {
        this.listManager.addFilter(field, key);
        this.dispatch();
    }
    removeListFilter(field, key) {
        this.listManager.removeFilter(field, key);
        this.dispatch();
    }
    sortListBy(field, sortBy, direction) {
        this.listManager.sortBy(field, sortBy, direction);
        this.dispatch();
    }
    addRangeFacet(field, index) {
        this.rangeManager.addFacet(field, index);
        this.dispatch();
    }
    addRangeFilter(field, min, max) {
        this.rangeManager.addFilter(field, min, max);
        this.dispatch();
    }
    addQuery(query) {
        this.query = query;
        this.dispatch();
    }
    reset() {
        this.query = '';
        this.listManager.reset();
        this.rangeManager.reset();
        this.dispatch();
    }
    setFacetCount(count) {
        this.facetCount = count;
        this.dispatch();
    }
    viewMoreFacetValues(field) {
        this.listManager.facets[field].viewMore();
        this.dispatch();
    }
    viewLessFacetValues(field) {
        this.listManager.facets[field].viewLess();
        this.dispatch();
    }
    dispatch() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const facets = Object.assign({}, this.listManager.facets, this.rangeManager.facets);
            this.request = new elastic_search_request_1.default(facets, this.query);
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
            const responseParser = new elastic_search_response_parser_1.default(response, facets);
            this.onChange(response, responseParser.facets);
        });
    }
}
exports.default = IOManager;
