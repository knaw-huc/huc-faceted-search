"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const facet_1 = require("./facet");
class ElasticSearchResponseParser {
    constructor(response, facets) {
        this.response = response;
        this.facets = facets;
        this.updateListFacets();
        this.updateRangeFacets();
    }
    updateListFacets() {
        Object.keys(this.facets)
            .map(key => this.facets[key])
            .filter(facet => facet.type === facet_1.FacetType.List)
            .forEach((facet) => {
            if (!this.response.aggregations.hasOwnProperty(facet.id))
                return;
            let { buckets } = this.response.aggregations[facet.id][facet.field];
            facet.values = Array.isArray(buckets) ? buckets : [];
        });
    }
    updateRangeFacets() {
        Object.keys(this.facets)
            .map(key => this.facets[key])
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
