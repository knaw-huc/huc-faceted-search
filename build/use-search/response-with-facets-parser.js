"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const constants_1 = require("../constants");
const response_parser_1 = tslib_1.__importDefault(require("./response-parser"));
function getBuckets(response, field, useValues = false) {
    const prop = useValues ? 'values' : 'buckets';
    const buckets = response.aggregations[field][field][prop];
    return buckets == null ? [] : buckets;
}
function addHierarchyBucket(parentField, response) {
    return function (bucket) {
        const childField = constants_1.getChildFieldName(parentField);
        let child = null;
        if (bucket.hasOwnProperty(childField)) {
            const buckets = bucket[childField][childField].buckets;
            if (buckets.length) {
                const values = buckets.map(addHierarchyBucket(childField, response));
                child = {
                    total: response.aggregations[`${childField}-count`][`${childField}-count`].value,
                    values,
                };
            }
        }
        return {
            key: bucket.key.toString(),
            count: bucket.doc_count,
            child,
        };
    };
}
function ESResponseWithFacetsParser(response, facets = new Map()) {
    const facetValues = {};
    facets.forEach(facet => {
        const buckets = getBuckets(response, facet.id);
        if (constants_1.isListFacet(facet)) {
            facetValues[facet.id] = {
                total: response.aggregations[`${facet.id}-count`][`${facet.id}-count`].value,
                values: buckets.map((b) => ({ key: b.key, count: b.doc_count }))
            };
        }
        if (constants_1.isHierarchyFacet(facet)) {
            const values = {
                total: response.aggregations[`${facet.id}-count`][`${facet.id}-count`].value,
                values: buckets.map(addHierarchyBucket(facet.id, response))
            };
            facetValues[facet.id] = values;
        }
        else if (constants_1.isBooleanFacet(facet)) {
            const trueBucket = buckets.find((b) => b.key === 1);
            const trueCount = trueBucket != null ? trueBucket.doc_count : 0;
            const falseBucket = buckets.find((b) => b.key === 0);
            const falseCount = falseBucket != null ? falseBucket.doc_count : 0;
            facetValues[facet.id] = [
                { key: 'true', count: trueCount },
                { key: 'false', count: falseCount },
            ];
        }
        else if (constants_1.isDateFacet(facet)) {
            facetValues[facet.id] = buckets.map(hv => ({
                key: hv.key,
                count: hv.doc_count,
            }));
            facet.interval = response.aggregations[facet.id][facet.id].interval;
        }
        else if (constants_1.isRangeFacet(facet)) {
            facetValues[facet.id] = buckets.map(hv => ({
                key: hv.key,
                count: hv.doc_count,
            }));
        }
    });
    const results = response_parser_1.default(response);
    return [results, facetValues];
}
exports.default = ESResponseWithFacetsParser;
