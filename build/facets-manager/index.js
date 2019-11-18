"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const getters_1 = tslib_1.__importDefault(require("./getters"));
class FacetsManager extends getters_1.default {
    addFilter(field, key, max) {
        const facetType = this.facets.get(field).type;
        if (facetType === "range" && typeof key === 'number') {
            const facet = this.getRangeFacet(field);
            const prevMin = facet.values[0].key;
            const prevMax = facet.values[facet.values.length - 1].key;
            if (prevMin !== key || prevMax !== max) {
                facet.filters = [key, max];
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
        this.getFacets().forEach(f => f.reset());
        this.handleChange();
    }
    setFacetCount(count) {
        this.facetCount = count;
        this.handleChange();
    }
    update(response) {
        this.getFacets().forEach(facet => {
            facet.values = response.facetValues[facet.field];
        });
    }
}
exports.default = FacetsManager;
