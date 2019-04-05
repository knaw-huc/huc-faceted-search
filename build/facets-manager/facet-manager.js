"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FacetManger {
    constructor() {
        this.facets = new Map();
        this.change = () => { };
    }
    onChange(func) {
        this.change = func;
    }
}
exports.default = FacetManger;
