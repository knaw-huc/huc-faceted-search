"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const facet_1 = require("../models/facet");
const facet_manager_1 = tslib_1.__importDefault(require("./facet-manager"));
class RangeManger extends facet_manager_1.default {
    addFacet(field, index) {
        this.facets[field] = new facet_1.RangeFacet(field, index);
        this.change();
    }
    addFilter(field, min, max) {
        this.facets[field].filter = [min, max];
        this.change();
    }
    reset() {
        for (const field of Object.keys(this.facets)) {
            this.facets[field] = new facet_1.RangeFacet(field, this.facets[field].index);
        }
    }
}
exports.default = RangeManger;
