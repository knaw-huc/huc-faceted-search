"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPOT_COLOR = '#08c';
exports.BACKGROUND_GRAY = '#f6f6f6';
function isBooleanFacet(facetConfig) {
    return facetConfig.datatype === "boolean";
}
exports.isBooleanFacet = isBooleanFacet;
function isDateFacet(facetConfig) {
    return facetConfig.datatype === "date";
}
exports.isDateFacet = isDateFacet;
function isHierarchyFacet(facetConfig) {
    return facetConfig.datatype === "hierarchy";
}
exports.isHierarchyFacet = isHierarchyFacet;
function isListFacet(facetConfig) {
    return facetConfig.datatype === "keyword";
}
exports.isListFacet = isListFacet;
function isRangeFacet(facetConfig) {
    return facetConfig.datatype === "integer";
}
exports.isRangeFacet = isRangeFacet;
function getChildFieldName(parentFieldName, number) {
    const [field, extractedNumber] = parentFieldName.split('_level');
    number = number != null ? number : parseInt(extractedNumber, 10) + 1;
    return `${field}_level${number}`;
}
exports.getChildFieldName = getChildFieldName;
