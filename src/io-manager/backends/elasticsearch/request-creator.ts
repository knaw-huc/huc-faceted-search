import { ListFacet, RangeFacet, BooleanFacet } from '../../../models/facet'
import FacetManager from '../../../facets-manager'

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

	constructor(facetsManager: FacetManager, public size: number) {
		this.setAggregations(facetsManager)
		this.setQuery(facetsManager)
	}

	private setQuery(facetsManager: FacetManager) {
		if (!facetsManager.query.length) return
		this.query = { query_string: { query: facetsManager.query } }
		this.highlight = { fields: { text: {} }, require_field_match: false }
	}

	private setAggregations(facetsManager: FacetManager) {
		this.setPostFilter(facetsManager)

		facetsManager.getFacets(FacetType.Boolean)
			.forEach(facet => this.aggs[facet.id] = this.createBooleanAggregation(facet))

		facetsManager.getFacets(FacetType.List)
			.forEach(facet => this.aggs[facet.id] = this.createListAggregation(facet))

		facetsManager.getFacets(FacetType.Range)
			.forEach(facet => {
				this.aggs[facet.id] = this.createRangeAggregation(facet)
				// TODO fix typings
				this.aggs[`${facet.id}_histogram`] = this.createHistogramAggregation(facet) as any

			})
	}

	private setPostFilter(facetsManager: FacetManager) {
		function toFilter(facet: BooleanFacet | ListFacet) {
			const allFacetFilters = [...facet.filters].map(key => ({ term: { [facet.field]: key } }))
			if (allFacetFilters.length === 1) return allFacetFilters[0]
			else if (allFacetFilters.length > 1) return { bool: { should: allFacetFilters } }
			return {}
		}

		const booleanFilters = facetsManager.getFacets(FacetType.Boolean)
			.filter(facet => facet.filters.size)
			.map(toFilter)

		const listFilters = facetsManager.getFacets(FacetType.List)
			.filter(facet => facet.filters.size)
			.map(toFilter)

		const rangeFilters = facetsManager.getFacets(FacetType.Range)
			.filter(facet => Array.isArray(facet.filter) && facet.filter.length === 2)
			.map(facet => ({
				range: {
					[facet.field]: {
						gte: facet.filter[0],
						lte: facet.filter[1]
					}
				}
			}))

		const filters = booleanFilters.concat(listFilters, rangeFilters as any)

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

	private addFilter(aggs: any) {
		const req: AggregationRequest = { aggs }
		req.filter = this.post_filter
		return req
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

	private createListAggregation(facet: ListFacet) {
		const terms = {
			field: facet.field,
			size: facet.viewSize,
			order: {
				[facet.order[0]]: facet.order[1]
			},
		}

		if (facet.query.length) (terms as any).include = `.*${facet.query}.*`
		
		const agg = {
			[facet.field]: { terms },
			[`${facet.field}-count`]: {
				cardinality: {
					field: facet.field
				}
			}
		}

		return this.addFilter(agg)
	}

	private createRangeAggregation(facet: RangeFacet) {
		const agg = {
			[facet.field]: {
				stats: {
					field: facet.field,
				}
			},
		}

		return this.addFilter(agg)
	}

	private createHistogramAggregation(facet: RangeFacet) {
		return {
			date_histogram: {
				field: facet.field,
				interval: "month",
			}
		}
	}
}
