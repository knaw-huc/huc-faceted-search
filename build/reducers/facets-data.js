"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function initBooleanFacet(booleanFacetConfig) {
    return Object.assign(Object.assign({}, booleanFacetConfig), { filters: new Set(), labels: booleanFacetConfig.labels || { true: 'Yes', false: 'No' } });
}
function initListFacet(listFacetConfig) {
    return Object.assign(Object.assign({}, listFacetConfig), { datatype: "keyword", filters: new Set(), sort: null, query: '', size: listFacetConfig.size || 10, viewSize: listFacetConfig.size || 10 });
}
function initRangeFacet(rangeFacetConfig) {
    return Object.assign(Object.assign({}, rangeFacetConfig), { filters: new Set(), type: rangeFacetConfig.type || 'timestamp' });
}
function isBooleanFacet(facetConfig) {
    return facetConfig.datatype === "boolean";
}
exports.isBooleanFacet = isBooleanFacet;
function isListFacet(facetConfig) {
    return facetConfig.datatype === "keyword";
}
exports.isListFacet = isListFacet;
function isRangeFacet(facetConfig) {
    return facetConfig.datatype === "date";
}
exports.isRangeFacet = isRangeFacet;
function facetsDataReducerInit(fields) {
    return fields
        .reduce((prev, curr) => {
        if (isListFacet(curr))
            prev.set(curr.id, initListFacet(curr));
        else if (isBooleanFacet(curr))
            prev.set(curr.id, initBooleanFacet(curr));
        else if (isRangeFacet(curr))
            prev.set(curr.id, initRangeFacet(curr));
        else
            prev.set(curr.id, initListFacet(curr));
        return prev;
    }, new Map());
}
exports.facetsDataReducerInit = facetsDataReducerInit;
function facetsDataReducer(facetsData, action) {
    if (action.type === 'clear') {
        return facetsDataReducerInit(action.fields);
    }
    const facet = facetsData.get(action.facetId);
    if (isListFacet(facet) || isBooleanFacet(facet)) {
        switch (action.type) {
            case 'add_filter': {
                facet.filters = new Set(facet.filters.add(action.value));
                return new Map(facetsData);
            }
            case 'remove_filter': {
                facet.filters.delete(action.value);
                facet.filters = new Set(facet.filters);
                return new Map(facetsData);
            }
        }
    }
    if (isListFacet(facet)) {
        switch (action.type) {
            case 'set_query': {
                facet.query = action.value;
                return new Map(facetsData);
            }
            case 'set_sort': {
                facet.sort = { by: action.by, direction: action.direction };
                return new Map(facetsData);
            }
            case 'view_less': {
                if (facet.viewSize > facet.size) {
                    facet.viewSize -= facet.size;
                    if (facet.viewSize < facet.size)
                        facet.viewSize = facet.size;
                    return new Map(facetsData);
                }
                break;
            }
            case 'view_more': {
                if (action.total - facet.viewSize > 0) {
                    facet.viewSize += facet.size;
                    return new Map(facetsData);
                }
                break;
            }
        }
    }
    return facetsData;
}
exports.default = facetsDataReducer;
