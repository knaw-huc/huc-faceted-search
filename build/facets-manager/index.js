"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const range_manager_1 = tslib_1.__importDefault(require("./range-manager"));
const list_manager_1 = tslib_1.__importDefault(require("./list-manager"));
const boolean_manager_1 = tslib_1.__importDefault(require("./boolean-manager"));
class FacetsManager {
    constructor(onChange) {
        this.onChange = onChange;
        this.query = '';
        this.booleanManager = new boolean_manager_1.default();
        this.listManager = new list_manager_1.default();
        this.rangeManager = new range_manager_1.default();
        this.booleanManager.onChange(() => this.handleChange());
        this.listManager.onChange(() => this.handleChange());
        this.rangeManager.onChange(() => this.handleChange());
    }
    handleChange() {
        const facets = Object.assign({}, this.booleanManager.facets, this.listManager.facets, this.rangeManager.facets);
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
        this.booleanManager.reset();
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
