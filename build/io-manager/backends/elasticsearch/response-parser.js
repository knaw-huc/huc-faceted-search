"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elasticSearchResponseParser = function elasticSearchResponseParser(response, facets) {
    const facetValues = response.aggregations;
    facets.forEach(facet => {
        if (facet.type === "list") {
            facetValues[facet.id] = {
                total: response.aggregations[facet.id][`${facet.field}-count`].value,
                values: response.aggregations[facet.id][facet.field].buckets.map((b) => ({ key: b.key, count: b.doc_count }))
            };
        }
        else if (facet.type === "boolean") {
            const trueBucket = response.aggregations[facet.id][facet.field].buckets.find((b) => b.key === 1);
            const trueCount = trueBucket != null ? trueBucket.doc_count : 0;
            const falseBucket = response.aggregations[facet.id][facet.field].buckets.find((b) => b.key === 0);
            const falseCount = falseBucket != null ? falseBucket.doc_count : 0;
            facetValues[facet.id] = {
                true: trueCount,
                false: falseCount
            };
        }
        else if (facet.type === "range") {
            const rangeResponse = response.aggregations[facet.id][facet.field];
            facetValues[facet.id] = [rangeResponse.min, rangeResponse.max];
            const histogramAggs = response.aggregations[`${facet.id}_histogram`];
            let histogramValues = histogramAggs.hasOwnProperty('buckets') ? histogramAggs.buckets : histogramAggs.date_histogram.buckets;
            facet.histogramValues = histogramValues != null ? histogramValues : [];
        }
    });
    return {
        facetValues,
        results: response.hits.hits
            .map((hit) => (Object.assign({ id: hit._id, snippets: hit.highlight ? hit.highlight.text : [] }, hit._source))),
        total: response.hits.total,
    };
};
exports.default = elasticSearchResponseParser;
