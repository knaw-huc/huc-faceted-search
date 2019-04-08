"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const facet_1 = require("../models/facet");
const getters_1 = tslib_1.__importDefault(require("./getters"));
const facetByType = {
    ["boolean"]: facet_1.BooleanFacet,
    ["list"]: facet_1.ListFacet,
    ["range"]: facet_1.RangeFacet,
};
class FacetManager extends getters_1.default {
    addFilter(field, key, max) {
        const facetType = this.facets.get(field).type;
        if (facetType === "range" && typeof key === 'number') {
            const facet = this.getRangeFacet(field);
            if (facet.filter == null)
                facet.filter = [0, 1];
            const [prevMin, prevMax] = facet.filter;
            if (prevMin !== key || prevMax !== max) {
                facet.filter = [key, max];
                this.handleChange();
            }
        }
        else if ((facetType === "list" || facetType === "boolean") &&
            typeof key === 'string') {
            const facet = this.getListFacet(field);
            if (!facet.filters.has(key)) {
                facet.filters.add(key);
                this.handleChange();
            }
        }
    }
    removeFilter(field, key) {
        this.getListFacet(field).filters.delete(key);
        this.handleChange();
    }
    addQuery(query) {
        this.query = query;
        this.handleChange();
    }
    sortListBy(field, sortBy, direction) {
        this.getListFacet(field).order = [sortBy, direction];
        this.handleChange();
    }
    addListFilterQuery(field, query) {
        this.getListFacet(field).query = query;
        this.handleChange();
    }
    viewLess(field) {
        this.getListFacet(field).viewLess();
        this.handleChange();
    }
    viewMore(field) {
        this.getListFacet(field).viewMore();
        this.handleChange();
    }
    reset() {
        this.query = '';
        for (const [field, facet] of this.facets) {
            const nextFacet = new facetByType[facet.type]();
            this.facets.set(field, nextFacet);
        }
        this.handleChange();
    }
    setFacetCount(count) {
        this.facetCount = count;
        this.handleChange();
    }
}
exports.default = FacetManager;
