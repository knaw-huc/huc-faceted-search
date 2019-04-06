"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isOfType(type) {
    return function (facetValue) {
        return facetValue[1].type === type;
    };
}
class FacetGetter {
    constructor() {
        this.facets = new Map();
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
}
exports.default = FacetGetter;
