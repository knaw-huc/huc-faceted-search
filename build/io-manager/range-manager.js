"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const facet_1 = require("../models/facet");
class RangeManger {
    constructor() {
        this.facets = {};
    }
    addFacet(field, index) {
        this.facets[field] = new facet_1.RangeFacet(field, index);
    }
    addFilter(field, min, max) {
        this.facets[field].filter = [min, max];
    }
    reset() {
        for (const field of Object.keys(this.facets)) {
            this.facets[field] = new facet_1.RangeFacet(field, this.facets[field].index);
        }
    }
}
exports.default = RangeManger;
