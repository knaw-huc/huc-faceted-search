"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const facet_1 = require("../models/facet");
const facet_manager_1 = tslib_1.__importDefault(require("./facet-manager"));
class ListFacetManager extends facet_manager_1.default {
    addFacet(field, index, size) {
        this.facets.set(field, new facet_1.ListFacet(field, index, size));
        this.change();
    }
    addFilter(field, key) {
        this.facets.get(field).filters.add(key);
        this.change();
    }
    removeFilter(field, key) {
        this.facets.get(field).filters.delete(key);
        this.change();
    }
    addQuery(field, query) {
        this.facets.get(field).query = query;
        this.change();
    }
    sortBy(field, sortBy, direction) {
        this.facets.get(field).order = [sortBy, direction];
        this.change();
    }
    reset() {
        for (const [field, facet] of this.facets) {
            this.facets.set(field, new facet_1.ListFacet(field, facet.index, facet.size));
        }
    }
    viewLess(field) {
        this.facets.get(field).viewLess();
        this.change();
    }
    viewMore(field) {
        this.facets.get(field).viewMore();
        this.change();
    }
}
exports.default = ListFacetManager;
