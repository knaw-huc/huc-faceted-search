"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
exports.SPOT_COLOR = '#08c';
exports.BACKGROUND_GRAY = '#f6f6f6';
function fetchSearchResults(url, request) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let fetchResponse;
        let response;
        try {
            fetchResponse = yield fetch(url, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });
            response = yield fetchResponse.json();
        }
        catch (err) {
            throw ('Failed to fetched Faceted Search state');
        }
        return fetchResponse.status === 200 ? response : null;
    });
}
exports.fetchSearchResults = fetchSearchResults;
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
