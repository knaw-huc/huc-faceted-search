"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const range_manager_1 = require("./range-manager");
const list_manager_1 = require("./list-manager");
class FacetsManager {
    constructor(onChange) {
        this.onChange = onChange;
        this.query = '';
        this.listManager = new list_manager_1.default();
        this.rangeManager = new range_manager_1.default();
        this.listManager.onChange(() => this.handleChange());
        this.rangeManager.onChange(() => this.handleChange());
    }
    handleChange() {
        const facets = Object.assign({}, this.listManager.facets, this.rangeManager.facets);
        if (this.facetCount == null || Object.keys(facets).length !== this.facetCount)
            return;
        this.onChange(facets, this.query);
    }
    addQuery(query) {
        this.query = query;
        this.handleChange();
    }
    reset() {
        this.query = '';
        this.listManager.reset();
        this.rangeManager.reset();
        this.handleChange();
    }
    setFacetCount(count) {
        this.facetCount = count;
        this.handleChange();
    }
}
exports.default = FacetsManager;
