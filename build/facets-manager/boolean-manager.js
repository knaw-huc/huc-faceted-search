"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const facet_1 = require("../models/facet");
const facet_manager_1 = tslib_1.__importDefault(require("./facet-manager"));
class BooleanManager extends facet_manager_1.default {
    addFacet(field, index) {
        this.facets.set(field, new facet_1.BooleanFacet(field, index));
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
    reset() {
        for (const [field, facet] of this.facets) {
            this.facets.set(field, new facet_1.BooleanFacet(field, facet.index));
        }
    }
}
exports.default = BooleanManager;
