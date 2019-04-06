import { FacetType, ListFacet, RangeFacet, Facets, BooleanFacet } from '../../models/facet'

interface AggregationRequest {
	aggs: any
	filter?: any
}

type Aggregations = { [id: string]: AggregationRequest }
export default class ElasticSearchRequest {
	aggs: Aggregations = {}
	highlight: { fields: { text: {} }, require_field_match: boolean }
	post_filter: any = {}
	query: any
	size: number = 20

	// TODO give ElasticSearchRequest access to facetsManager?
	constructor(facets: Facets = new Map(), query: string = '') {
		this.setAggs(facets)
		this.setPostFilter(facets)

		if (query.length) {
			this.query = { query_string: { query } }
			this.highlight = { fields: { text: {} }, require_field_match: false }
		}
	}

	private createBooleanAggregation(facet: BooleanFacet) {
		const aggs = {
			[facet.field]: {
				terms: {
					field: facet.field
				}
			},
		}

		return this.addFilter(aggs)
	}

	private addFilter(aggs: any) {
		const req: AggregationRequest = { aggs }
		req.filter = this.post_filter
		return req

	}

	private createListAggregation(facet: ListFacet) {
		const terms = {
			field: facet.field,
			size: facet.viewSize,
			order: {
				[facet.order[0]]: facet.order[1]
			},
		}

		if (facet.query.length) (terms as any).include = `.*${facet.query}.*`
		
		const aggs = {
			[facet.field]: { terms },
			[`${facet.field}-count`]: {
				cardinality: {
					field: facet.field
				}
			}
		}

		return this.addFilter(aggs)
	}

	private createRangeAggregation(facet: RangeFacet) {
		const aggs = {
			[facet.field]: {
				stats: {
					field: facet.field,
				}
			},
		}

		return this.addFilter(aggs)
	}

	private createHistogramAggregation(facet: RangeFacet) {
		return {
			date_histogram: {
				field: facet.field,
				interval: "year",
			}
		}
	}

	private setAggs(facets: Facets) {
		for (const facet of facets.values()) {
			if (facet.type === FacetType.List) this.aggs[facet.id] = this.createListAggregation(facet as ListFacet)
			else if (facet.type === FacetType.Boolean) this.aggs[facet.id] = this.createBooleanAggregation(facet as BooleanFacet)
			else if (facet.type === FacetType.Range) {
				this.aggs[facet.id] = this.createRangeAggregation(facet as RangeFacet)
				// TODO fix typings
				this.aggs[`${facet.id}_histogram`] = this.createHistogramAggregation(facet as RangeFacet) as any

			}
		}
	}

	private setPostFilter(facets: Facets) {
		const filters: any[] = []

		for (const facet of facets.values()) {
			if (facet.type === FacetType.List || facet.type === FacetType.Boolean) {
				let facetFilters: any
				const allFacetFilters = [...facet.filters].map(key => ({ term: { [facet.field]: key } }))
				if (allFacetFilters.length === 1) facetFilters = allFacetFilters[0]
				else if (allFacetFilters.length > 1) facetFilters = { bool: { should: allFacetFilters } }
				if (facetFilters) filters.push(facetFilters)
			}
			// TODO check if instanceof holds when minified
			else if (facet instanceof RangeFacet && Array.isArray(facet.filter) && facet.filter.length === 2) {
				filters.push({
					range: {
						[facet.field]: {
							gte: facet.filter[0],
							lte: facet.filter[1]
						}
					}
				})
			}
		}

		if (!filters.length) {
			this.post_filter = {}
		} else if (filters.length === 1) {
			this.post_filter = filters[0]
		} else if (filters.length > 1) {
			this.post_filter = {
				bool: {
					must: filters
				}
			}

		}
	}
}