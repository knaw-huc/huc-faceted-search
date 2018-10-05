"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const facet_1 = require("../models/facet");
class ListFacetManager {
    constructor() {
        this.facets = {};
    }
    addFacet(field, index, size) {
        this.facets[field] = new facet_1.ListFacet(field, index, size);
    }
    addFilter(field, key) {
        this.facets[field].filters.add(key);
    }
    removeFilter(field, key) {
        this.facets[field].filters.delete(key);
    }
    reset() {
        for (const field of Object.keys(this.facets)) {
            this.facets[field] = new facet_1.ListFacet(field, this.facets[field].index, this.facets[field].size);
        }
    }
    addQuery(field, query) {
        this.facets[field].query = query;
    }
    sortBy(field, sortBy, direction) {
        this.facets[field].order = [sortBy, direction];
    }
}
exports.default = ListFacetManager;
