import { Facets, ListFacetValue, FacetType, ListFacet, RangeFacet } from '../../models/facet'

interface ParsedResponse {
	aggregations: { [id: string]: any}
	hits: any[]
	total: number
}

export interface ElasticSearchResponse {
	aggregations: { [id: string]: any}
	hits: {
		hits: { _source: any }[]
		total: number
	}
}

export default class ElasticSearchResponseParser {
	parsedResponse: ParsedResponse = {
		aggregations: {},
		hits: [],
		total: 0
	}

	constructor(private response: ElasticSearchResponse, public facets: Facets) {
		this.updateListFacets()
		this.updateRangeFacets()
		this.parseResponse(response)
	}

	private parseResponse(response: ElasticSearchResponse) {
		this.parsedResponse = {
			aggregations: response.aggregations,
			hits: response.hits.hits
				.map((hit: any) => ({
					id: hit._id,
					snippets: hit.highlight ? hit.highlight.text : [],
					...hit._source
				})),
			total: response.hits.total,
		}
	}

	private updateListFacets() {
		Object.keys(this.facets)
			.map(key => this.facets[key])
			.filter(facet => facet.type === FacetType.List)
			.forEach((facet: ListFacet) => {
				if (!this.response.aggregations.hasOwnProperty(facet.id)) return
				let { buckets } = this.response.aggregations[facet.id][facet.field] as { buckets: ListFacetValue[] }
				facet.values = Array.isArray(buckets) ? buckets : []

				const { value } = this.response.aggregations[facet.id][`${facet.field}-count`]
				facet.total = value
			})
	}

	private updateRangeFacets() {
		Object.keys(this.facets)
			.map(key => this.facets[key])
			.filter(facet => facet.type === FacetType.Range)
			.forEach((facet: RangeFacet) => {
				if (facet.values[0] != null && facet.values[1] != null) return
				if (!this.response.aggregations.hasOwnProperty(facet.id)) return
				const { min, max } = this.response.aggregations[facet.id][facet.field]
				facet.values = [min, max]
				facet.histogramValues = this.response.aggregations[`${facet.id}_histogram`].buckets
			})
	}
}