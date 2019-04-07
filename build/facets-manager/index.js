"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const facet_1 = require("../models/facet");
const getters_1 = tslib_1.__importDefault(require("./getters"));
const facetByType = {
    [facet_1.FacetType.Boolean]: facet_1.BooleanFacet,
    [facet_1.FacetType.List]: facet_1.ListFacet,
    [facet_1.FacetType.Range]: facet_1.RangeFacet,
};
class FacetsManager extends getters_1.default {
    constructor(onChange) {
        super();
        this.onChange = onChange;
        this.query = '';
    }
    addFacet(type, field, index, thirdArg) {
        this.facets.set(field, new facetByType[type](field, index, thirdArg));
        this.handleChange();
    }
    addFilter(field, key, max) {
        const facetType = this.facets.get(field).type;
        if (facetType === facet_1.FacetType.Range && typeof key === 'number') {
            const facet = this.getRangeFacet(field);
            const [prevMin, prevMax] = facet.filter;
            if (prevMin !== key || prevMax !== max) {
                facet.filter = [key, max];
                this.handleChange();
            }
        }
        else if ((facetType === facet_1.FacetType.List || facetType === facet_1.FacetType.Boolean) &&
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
    addQuery(query) {
        this.query = query;
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
    handleChange() {
        if (this.facetCount == null || this.facets.size !== this.facetCount)
            return;
        this.onChange(new Map(this.facets), this.query);
    }
}
exports.default = FacetsManager;
