"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const facet_1 = require("../models/facet");
function isOfType(type) {
    return function (facetValue) {
        return facetValue[1].type === type;
    };
}
class FacetGetter {
    constructor() {
        this.facets = new Map();
        this.query = '';
    }
    getFacets(type) {
        return [...this.facets].filter(isOfType(type)).map(f => f[1]);
    }
    getBooleanFacet(field) {
        return this.facets.get(field);
    }
    getRangeFacet(field) {
        return this.facets.get(field);
    }
    getListFacet(field) {
        return this.facets.get(field);
    }
    setBooleanFacet(field, index, settings) {
        this.facets.set(field, new facet_1.BooleanFacet(field, index, settings));
        this.handleChange();
    }
    setListFacet(field, index, settings) {
        this.facets.set(field, new facet_1.ListFacet(field, index, settings));
        this.handleChange();
    }
    setRangeFacet(field, index, settings) {
        this.facets.set(field, new facet_1.RangeFacet(field, index, settings));
        this.handleChange();
    }
    handleChange() {
        if (this.onChange == null ||
            this.facetCount == null ||
            this.facets.size !== this.facetCount)
            return;
        this.facets = new Map(this.facets);
        this.onChange();
    }
}
exports.default = FacetGetter;
