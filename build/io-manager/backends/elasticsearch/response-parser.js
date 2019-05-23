"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ElasticSearchResponseParser {
    constructor(response, facetsManager) {
        this.response = response;
        this.facetsManager = facetsManager;
        this.parsedResponse = {
            aggregations: {},
            hits: [],
            total: 0
        };
        this.updateBooleanFacets();
        this.updateListFacets();
        this.updateRangeFacets();
        this.parseResponse(response);
    }
    parseResponse(response) {
        this.parsedResponse = {
            aggregations: response.aggregations,
            hits: response.hits.hits
                .map((hit) => (Object.assign({ id: hit._id, snippets: hit.highlight ? hit.highlight.text : [] }, hit._source))),
            total: response.hits.total,
        };
    }
    updateBooleanFacets() {
        this.facetsManager.getFacets("boolean")
            .forEach(facet => {
            if (!this.response.aggregations.hasOwnProperty(facet.id))
                return;
            let { buckets } = this.response.aggregations[facet.id][facet.field];
            facet.values = Array.isArray(buckets) ? buckets : [];
            facet.values = facet.values.map(value => {
                value.key = value.key.toString();
                return value;
            });
        });
    }
    updateListFacets() {
        this.facetsManager.getFacets("list")
            .forEach((facet) => {
            if (!this.response.aggregations.hasOwnProperty(facet.id))
                return;
            let { buckets } = this.response.aggregations[facet.id][facet.field];
            facet.values = Array.isArray(buckets) ? buckets : [];
            const { value } = this.response.aggregations[facet.id][`${facet.field}-count`];
            facet.total = value;
        });
    }
    updateRangeFacets() {
        this.facetsManager.getFacets("range")
            .forEach(facet => {
            if (!this.response.aggregations.hasOwnProperty(facet.id))
                return;
            const { min, max } = this.response.aggregations[facet.id][facet.field];
            if (!facet.values.filter(v => v != null).length && min != null && max != null)
                facet.values = [min, max];
            const histogramAggs = this.response.aggregations[`${facet.id}_histogram`];
            console.log(facet);
            let histogramValues = histogramAggs.hasOwnProperty('buckets') ? histogramAggs.buckets : histogramAggs.date_histogram.buckets;
            facet.histogramValues = histogramValues != null ? histogramValues : [];
        });
    }
}
exports.default = ElasticSearchResponseParser;
