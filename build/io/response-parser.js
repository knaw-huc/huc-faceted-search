"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
function getBuckets(response, field, useValues = false) {
    const prop = useValues ? 'values' : 'buckets';
    const buckets = response.aggregations[field][field][prop];
    return buckets == null ? [] : buckets;
}
function elasticSearchResponseParser(response, facets) {
    const facetValues = {};
    facets.forEach(facet => {
        const buckets = getBuckets(response, facet.id);
        if (constants_1.isListFacet(facet)) {
            facetValues[facet.id] = {
                total: response.aggregations[`${facet.id}-count`][`${facet.id}-count`].value,
                values: buckets.map((b) => ({ key: b.key, count: b.doc_count }))
            };
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
            facetValues[facet.id] = buckets.map((hv) => ({
                key: hv.key,
                count: hv.doc_count,
            }));
            facet.interval = response.aggregations[facet.id][facet.id].interval;
        }
        else if (constants_1.isRangeFacet(facet)) {
            facetValues[facet.id] = buckets.map((hv) => ({
                key: hv.key,
                count: hv.doc_count,
            }));
        }
    });
    return {
        facetValues,
        results: response.hits.hits
            .map((hit) => (Object.assign({ id: hit._id, snippets: hit.highlight ? hit.highlight.text : [] }, hit._source))),
        total: response.hits.total.value,
    };
}
exports.default = elasticSearchResponseParser;
