"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const facet_1 = require("../../models/facet");
class ElasticSearchResponseParser {
    constructor(response, facets) {
        this.response = response;
        this.facets = facets;
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
        Object.keys(this.facets)
            .map(key => this.facets.get(key))
            .filter(facet => facet.type === facet_1.FacetType.Boolean)
            .forEach((facet) => {
            if (!this.response.aggregations.hasOwnProperty(facet.id))
                return;
            let { buckets } = this.response.aggregations[facet.id][facet.field];
            facet.values = Array.isArray(buckets) ? buckets : [];
        });
    }
    updateListFacets() {
        Object.keys(this.facets)
            .map(key => this.facets.get(key))
            .filter(facet => facet.type === facet_1.FacetType.List)
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
        Object.keys(this.facets)
            .map(key => this.facets.get(key))
            .filter(facet => facet.type === facet_1.FacetType.Range)
            .forEach((facet) => {
            if (facet.values[0] != null && facet.values[1] != null)
                return;
            if (!this.response.aggregations.hasOwnProperty(facet.id))
                return;
            const { min, max } = this.response.aggregations[facet.id][facet.field];
            facet.values = [min, max];
            facet.histogramValues = this.response.aggregations[`${facet.id}_histogram`].buckets;
        });
    }
}
exports.default = ElasticSearchResponseParser;
