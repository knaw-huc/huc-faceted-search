"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const facet_1 = require("../models/facet");
const facet_manager_1 = tslib_1.__importDefault(require("./facet-manager"));
class ListFacetManager extends facet_manager_1.default {
    addFacet(field, index, size) {
        this.facets[field] = new facet_1.ListFacet(field, index, size);
        this.change();
    }
    addFilter(field, key) {
        this.facets[field].filters.add(key);
        this.change();
    }
    removeFilter(field, key) {
        this.facets[field].filters.delete(key);
        this.change();
    }
    addQuery(field, query) {
        this.facets[field].query = query;
        this.change();
    }
    sortBy(field, sortBy, direction) {
        this.facets[field].order = [sortBy, direction];
        this.change();
    }
    reset() {
        for (const field of Object.keys(this.facets)) {
            this.facets[field] = new facet_1.ListFacet(field, this.facets[field].index, this.facets[field].size);
        }
    }
    viewLess(field) {
        this.facets[field].viewLess();
        this.change();
    }
    viewMore(field) {
        this.facets[field].viewMore();
        this.change();
    }
}
exports.default = ListFacetManager;
