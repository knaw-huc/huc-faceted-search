"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseFacet {
    constructor(field, index, type) {
        this.field = field;
        this.index = index;
        this.type = type;
        this.id = `${field}_${index}`;
    }
}
exports.BaseFacet = BaseFacet;
class ListFacet extends BaseFacet {
    constructor(field, index, settings) {
        super(field, index, "list");
        this.settings = settings;
        this.type = "list";
        this.reset();
    }
    reset() {
        this.filters = new Set();
        this.order = ["_count", "desc"];
        this.query = '';
        this.total = 0;
        this.values = {
            total: 0,
            values: [],
        };
        this.viewSize = this.settings.size;
    }
    viewLess() {
        if (this.viewSize > this.settings.size)
            this.viewSize -= this.settings.size;
    }
    viewMore() {
        this.viewSize += this.settings.size;
    }
}
exports.ListFacet = ListFacet;
class BooleanFacet extends BaseFacet {
    constructor(field, index, settings) {
        super(field, index, "boolean");
        this.settings = settings;
        this.type = "boolean";
        this.reset();
    }
    reset() {
        this.filters = new Set();
        this.values = { true: 0, false: 0 };
    }
}
exports.BooleanFacet = BooleanFacet;
class RangeFacet extends BaseFacet {
    constructor(field, index, settings) {
        super(field, index, "range");
        this.settings = settings;
        this.reset();
    }
    reset() {
        this.filter = null;
        this.histogramValues = [];
        this.values = [null, null];
    }
}
exports.RangeFacet = RangeFacet;
