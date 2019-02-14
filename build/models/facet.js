"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FacetType;
(function (FacetType) {
    FacetType[FacetType["Boolean"] = 0] = "Boolean";
    FacetType[FacetType["List"] = 1] = "List";
    FacetType[FacetType["Range"] = 2] = "Range";
})(FacetType = exports.FacetType || (exports.FacetType = {}));
var SortBy;
(function (SortBy) {
    SortBy["Count"] = "_count";
    SortBy["Key"] = "_term";
})(SortBy = exports.SortBy || (exports.SortBy = {}));
var SortDirection;
(function (SortDirection) {
    SortDirection["Asc"] = "asc";
    SortDirection["Desc"] = "desc";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
class Facet {
    constructor(field, index, type) {
        this.field = field;
        this.index = index;
        this.type = type;
        this.id = `${field}_${index}`;
    }
}
exports.Facet = Facet;
class ListFacet extends Facet {
    constructor(field, index, size) {
        super(field, index, FacetType.List);
        this.size = size;
        this.filters = new Set();
        this.order = [SortBy.Count, SortDirection.Desc];
        this.query = '';
        this.total = 0;
        this.values = [];
        this.viewSize = size;
    }
    viewLess() {
        if (this.viewSize > this.size)
            this.viewSize -= this.size;
    }
    viewMore() {
        this.viewSize += this.size;
    }
}
exports.ListFacet = ListFacet;
class BooleanFacet extends Facet {
    constructor(field, index) {
        super(field, index, FacetType.Boolean);
        this.filters = new Set();
        this.values = [];
    }
}
exports.BooleanFacet = BooleanFacet;
class RangeFacet extends Facet {
    constructor(field, index) {
        super(field, index, FacetType.Range);
        this.histogramValues = [];
        this.values = [null, null];
    }
}
exports.RangeFacet = RangeFacet;
