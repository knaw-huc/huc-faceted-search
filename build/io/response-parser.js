"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getBuckets(response, field) {
    const buckets = response.aggregations[field][field].buckets;
    return buckets == null ? [] : buckets;
}
function elasticSearchResponseParser(response, facets) {
    const facetValues = {};
    facets.forEach(facet => {
        const buckets = getBuckets(response, facet.id);
        if (facet.datatype === "keyword") {
            facetValues[facet.id] = {
                total: response.aggregations[`${facet.id}-count`][`${facet.id}-count`].value,
                values: buckets.map((b) => ({ key: b.key, count: b.doc_count }))
            };
        }
        else if (facet.datatype === "boolean") {
            const trueBucket = buckets.find((b) => b.key === 1);
            const trueCount = trueBucket != null ? trueBucket.doc_count : 0;
            const falseBucket = buckets.find((b) => b.key === 0);
            const falseCount = falseBucket != null ? falseBucket.doc_count : 0;
            facetValues[facet.id] = {
                true: trueCount,
                false: falseCount
            };
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
