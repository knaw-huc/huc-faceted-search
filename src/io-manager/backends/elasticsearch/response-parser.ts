import FacetManager from '../../../facets-manager'

export default class ElasticSearchResponseParser {
	parsedResponse: ParsedResponse = {
		aggregations: {},
		hits: [],
		total: 0
	}

	constructor(private response: ElasticSearchResponse, private facetsManager: FacetManager) {
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
		this.facetsManager.getFacets(FacetType.Boolean)
			.forEach(facet => {
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
		this.facetsManager.getFacets(FacetType.List)
			.forEach((facet) => {
				if (!this.response.aggregations.hasOwnProperty(facet.id)) return
				let { buckets } = this.response.aggregations[facet.id][facet.field] as { buckets: ListFacetValue[] }
				facet.values = Array.isArray(buckets) ? buckets : []

				const { value } = this.response.aggregations[facet.id][`${facet.field}-count`]
				facet.total = value
			})
	}

	private updateRangeFacets() {
		this.facetsManager.getFacets(FacetType.Range)
			.forEach(facet => {
				if (facet.values[0] != null && facet.values[1] != null) return
				if (!this.response.aggregations.hasOwnProperty(facet.id)) return
				const { min, max } = this.response.aggregations[facet.id][facet.field]
				facet.values = [min, max]
				facet.histogramValues = this.response.aggregations[`${facet.id}_histogram`].buckets
			})
	}
}