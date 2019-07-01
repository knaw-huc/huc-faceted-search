"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const facet_1 = require("../models/facet");
function isOfType(type) {
    return function (facetValue) {
        if (type == null)
            return true;
        return facetValue[1].type === type;
    };
}
class FacetGetter {
    constructor(options) {
        this.options = options;
        this.facets = new Map();
        this.query = '';
    }
    getFacets(type) {
        return [...this.facets].filter(isOfType(type)).map(f => f[1]);
    }
    getFacet(field) {
        return this.facets.get(field);
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
        if (this.options.onChange == null ||
            this.facetCount == null ||
            this.facets.size !== this.facetCount)
            return;
        this.facets = new Map(this.facets);
        this.options.onChange();
    }
}
exports.default = FacetGetter;
