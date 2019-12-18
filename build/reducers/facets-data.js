"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function facetsDataReducerInit(fields) {
    return fields
        .reduce((prev, curr) => {
        const facetData = Object.assign(Object.assign({}, curr), { filters: new Set(), sort: null, query: '', size: curr.size || 10, viewSize: curr.size || 10 });
        prev.set(curr.id, facetData);
        return prev;
    }, new Map());
}
exports.facetsDataReducerInit = facetsDataReducerInit;
function facetsDataReducer(facetsData, action) {
    if (action.type === 'clear') {
        for (const facetData of facetsData.values()) {
            facetData.filters = new Set();
            facetData.query = '';
            facetData.sort = null;
        }
        return new Map(facetsData);
    }
    const facet = facetsData.get(action.facetId);
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
    return facetsData;
}
exports.default = facetsDataReducer;
