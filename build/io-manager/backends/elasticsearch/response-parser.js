"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elasticSearchResponseParser = function elasticSearchResponseParser(response, facets) {
    const facetValues = {};
    facets.forEach(facet => {
        if (facet.type === "list") {
            facetValues[facet.field] = {
                total: response.aggregations[`${facet.field}-count`].value,
                values: response.aggregations[facet.field].buckets.map((b) => ({ key: b.key, count: b.doc_count }))
            };
        }
        else if (facet.type === "boolean") {
            const trueBucket = response.aggregations[facet.field].buckets.find((b) => b.key === 1);
            const trueCount = trueBucket != null ? trueBucket.doc_count : 0;
            const falseBucket = response.aggregations[facet.field].buckets.find((b) => b.key === 0);
            const falseCount = falseBucket != null ? falseBucket.doc_count : 0;
            facetValues[facet.field] = {
                true: trueCount,
                false: falseCount
            };
        }
        else if (facet.type === "range") {
            facetValues[facet.field] = response.aggregations[facet.field].buckets.map((hv) => ({
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
};
exports.default = elasticSearchResponseParser;
