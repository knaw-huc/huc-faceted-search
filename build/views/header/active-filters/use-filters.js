"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const constants_1 = require("../../../constants");
const utils_1 = require("../../facets/date/utils");
function hasFilter(facetData) {
    if (facetData.filters == null)
        return false;
    if (constants_1.isListFacet(facetData) || constants_1.isBooleanFacet(facetData) || constants_1.isHierarchyFacet(facetData)) {
        return facetData.filters.size > 0;
    }
    else if (constants_1.isRangeFacet(facetData) || constants_1.isDateFacet(facetData)) {
        return facetData.filters.hasOwnProperty('from') && facetData.filters.from != null;
    }
    return false;
}
function getFilterValue(facetData) {
    if (!hasFilter(facetData))
        return [];
    if (constants_1.isListFacet(facetData) || constants_1.isBooleanFacet(facetData) || constants_1.isHierarchyFacet(facetData)) {
        return Array.from(facetData.filters);
    }
    else if (constants_1.isRangeFacet(facetData)) {
        return [`${facetData.filters.from} - ${facetData.filters.to}`];
    }
    else if (constants_1.isDateFacet(facetData)) {
        return [`${utils_1.formatDate(facetData.filters.from, facetData.interval)} - ${utils_1.formatDate(facetData.filters.to, facetData.interval)}`];
    }
    return [];
}
function useFilters(facetsData) {
    const [filters, setFilters] = React.useState([]);
    React.useEffect(() => {
        const activeFilters = [];
        for (const facetData of facetsData.values()) {
            const values = getFilterValue(facetData);
            if (values.length) {
                activeFilters.push({
                    id: facetData.id,
                    title: facetData.title,
                    values,
                });
            }
        }
        setFilters(activeFilters);
    }, [facetsData]);
    return filters;
}
exports.default = useFilters;
