"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const constants_1 = require("../constants");
const react_1 = tslib_1.__importDefault(require("react"));
function initBooleanFacet(booleanFacetConfig) {
    return Object.assign(Object.assign({}, booleanFacetConfig), { filters: new Set(), labels: booleanFacetConfig.labels || { true: 'Yes', false: 'No' } });
}
function initDateFacet(rangeFacetConfig) {
    return Object.assign(Object.assign({}, rangeFacetConfig), { filters: null, interval: null });
}
function initListFacet(listFacetConfig) {
    return Object.assign(Object.assign({}, listFacetConfig), { datatype: "keyword", filters: new Set(), sort: null, query: '', size: listFacetConfig.size || 10, viewSize: listFacetConfig.size || 10 });
}
function initRangeFacet(rangeFacetConfig) {
    return Object.assign(Object.assign({}, rangeFacetConfig), { filters: null, max: null, min: null });
}
function initFacetsData(fields) {
    return fields
        .reduce((prev, curr) => {
        if (constants_1.isListFacet(curr))
            prev.set(curr.id, initListFacet(curr));
        else if (constants_1.isBooleanFacet(curr))
            prev.set(curr.id, initBooleanFacet(curr));
        else if (constants_1.isRangeFacet(curr))
            prev.set(curr.id, initRangeFacet(curr));
        else if (constants_1.isDateFacet(curr))
            prev.set(curr.id, initDateFacet(curr));
        return prev;
    }, new Map());
}
exports.initFacetsData = initFacetsData;
function useFacetsDataReducer(fields) {
    const x = react_1.default.useReducer(facetsDataReducer, initFacetsData(fields));
    react_1.default.useEffect(() => {
        x[1]({ type: 'clear', fields });
    }, [fields]);
    return x;
}
exports.default = useFacetsDataReducer;
function facetsDataReducer(facetsData, action) {
    if (action.type === 'clear') {
        return initFacetsData(action.fields);
    }
    const facet = facetsData.get(action.facetId);
    if (constants_1.isListFacet(facet) || constants_1.isBooleanFacet(facet)) {
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
    if (constants_1.isRangeFacet(facet)) {
        switch (action.type) {
            case 'set_range': {
                const { type } = action, filter = tslib_1.__rest(action, ["type"]);
                facet.filters = filter;
                return new Map(facetsData);
            }
            case 'remove_filter': {
                facet.filters = null;
                return new Map(facetsData);
            }
        }
    }
    if (constants_1.isListFacet(facet)) {
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
