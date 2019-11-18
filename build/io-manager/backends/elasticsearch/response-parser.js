"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getBuckets(response, field) {
    const buckets = response.aggregations[field][field].buckets;
    return buckets == null ? [] : buckets;
}
const elasticSearchResponseParser = function elasticSearchResponseParser(response, facets) {
    const facetValues = {};
    facets.forEach(facet => {
        const buckets = getBuckets(response, facet.field);
        if (facet.type === "list") {
            facetValues[facet.field] = {
                total: response.aggregations[`${facet.field}-count`].value,
                values: buckets.map((b) => ({ key: b.key, count: b.doc_count }))
            };
        }
        else if (facet.type === "boolean") {
            const trueBucket = buckets.find((b) => b.key === 1);
            const trueCount = trueBucket != null ? trueBucket.doc_count : 0;
            const falseBucket = buckets.find((b) => b.key === 0);
            const falseCount = falseBucket != null ? falseBucket.doc_count : 0;
            facetValues[facet.field] = {
                true: trueCount,
                false: falseCount
            };
        }
        else if (facet.type === "range") {
            const rangeFacet = facet;
            const { field, values } = rangeFacet;
            if (!values.length) {
                facetValues[field] = buckets.map((hv) => ({
                    key: hv.key,
                    count: hv.doc_count,
                }));
            }
            else {
                facetValues[field] = values;
                if (buckets.length) {
                    const minValue = values[0].key;
                    const maxValue = values[values.length - 1].key;
                    const lowerLimitTimestamp = buckets[0].key;
                    const upperLimitTimestamp = buckets[buckets.length - 1].key;
                    if (minValue !== lowerLimitTimestamp ||
                        maxValue !== upperLimitTimestamp) {
                        facetValues[field] = values;
                        rangeFacet.filters = buckets.length ?
                            [lowerLimitTimestamp, upperLimitTimestamp] :
                            null;
                    }
                }
            }
            rangeFacet.interval = response.aggregations[facet.field][facet.field].interval;
        }
    });
    return {
        facetValues,
        results: response.hits.hits
            .map((hit) => (Object.assign({ id: hit._id, snippets: hit.highlight ? hit.highlight.text : [] }, hit._source))),
        total: response.hits.total.value,
    };
};
exports.default = elasticSearchResponseParser;
