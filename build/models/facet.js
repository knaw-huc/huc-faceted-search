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
class ListFacet extends BaseFacet {
    constructor(field, index, settings) {
        super(field, index, "list");
        this.settings = settings;
        this.filters = new Set();
        this.order = ["_count", "desc"];
        this.query = '';
        this.total = 0;
        this.type = "list";
        this.values = [];
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
        this.filters = new Set();
        this.type = "boolean";
        this.values = [];
    }
}
exports.BooleanFacet = BooleanFacet;
class RangeFacet extends BaseFacet {
    constructor(field, index, settings) {
        super(field, index, "range");
        this.settings = settings;
        this.histogramValues = [];
        this.values = [null, null];
    }
}
exports.RangeFacet = RangeFacet;
