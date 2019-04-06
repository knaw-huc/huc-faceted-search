import { Facets, ListFacetValue, FacetType, ListFacet, RangeFacet  } from '../../models/facet'

export interface ParsedResponse {
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
		this.updateBooleanFacets()
		this.updateListFacets()
		this.updateRangeFacets()
		this.parseResponse(response)
	}

	private parseResponse(response: ElasticSearchResponse) {
		this.parsedResponse = {
			aggregations: response.aggregations,
			hits: response.hits.hits
				.map((hit: any): Hit => ({
					id: hit._id,
					snippets: hit.highlight ? hit.highlight.text : [],
					...hit._source
				})),
			total: response.hits.total,
		}
	}

	private updateBooleanFacets() {
		this.facets
			.forEach(facet => {
				if (facet.type !== FacetType.Boolean) return
				if (!this.response.aggregations.hasOwnProperty(facet.id)) return
				let { buckets } = this.response.aggregations[facet.id][facet.field] as { buckets: ListFacetValue[] }
				facet.values = Array.isArray(buckets) ? buckets : []
				facet.values = facet.values.map(value => {
					value.key = value.key.toString()
					return value
				})
			})
	}

	private updateListFacets() {
		Object.keys(this.facets)
			.map(key => this.facets.get(key))
			.filter(facet => facet.type === FacetType.List)
			.forEach((facet: ListFacet) => {
				if (!this.response.aggregations.hasOwnProperty(facet.id)) return
				let { buckets } = this.response.aggregations[facet.id][facet.field] as { buckets: ListFacetValue[] }
				facet.values = Array.isArray(buckets) ? buckets : []

				const { value } = this.response.aggregations[facet.id][`${facet.field}-count`]
				facet.total = value
			})
	}

	// TODO this.facets is a Map now, fix it
	private updateRangeFacets() {
		Object.keys(this.facets)
			.map(key => this.facets.get(key))
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