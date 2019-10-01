import { ListFacet, RangeFacet, BooleanFacet } from '../../../models/facet'

interface AggregationRequest {
	aggs: any
	filter?: any
}

type Aggregations = { [id: string]: AggregationRequest }
export default class ElasticSearchRequest {
	aggs: Aggregations = {}
	highlight: { fields: { text: {} }, require_field_match: boolean }
	post_filter: Record<string, any>
	query: Record<string, any>

	constructor(facets: Facet[], facetsManagerQuery: string, public size: number) {
		this.setPostFilter(facets)
		this.setAggregations(facets)
		this.setQuery(facetsManagerQuery)
	}

	private setQuery(query: string) {
		if (!query.length) return
		this.query = { query_string: { query } }
		this.highlight = { fields: { text: {} }, require_field_match: false }
	}

	private setAggregations(facets: Facet[]) {
		// facetsManager.getFacets(FacetType.Boolean)
		facets.filter(f => f.type === FacetType.Boolean)
			.forEach(facet => {
				this.aggs = {
					...this.aggs,
					...this.createBooleanAggregation(facet as BooleanFacet).aggs,
				}
			})

		facets.filter(f => f.type === FacetType.List)
			.forEach(facet => {
				// this.aggs[facet.id] = this.createListAggregation(facet as ListFacet)
				this.aggs = {
					...this.aggs,
					...this.createListAggregation(facet as ListFacet).aggs
				}
			})

		facets.filter(f => f.type === FacetType.Range)
			.forEach((facet: RangeFacet) => {
				this.aggs = {
					...this.aggs,
					...this.createRangeAggregation(facet).aggs,
					...this.createHistogramAggregation(facet)
				}
				// TODO fix typings
				// this.aggs[`${facet.field}_histogram`] = 

			})
	}

	private setPostFilter(facets: Facet[]) {
		function toFilter(facet: BooleanFacet | ListFacet) {
			const allFacetFilters = [...facet.filters].map(key => ({ term: { [facet.field]: key } }))
			if (allFacetFilters.length === 1) return allFacetFilters[0]
			else if (allFacetFilters.length > 1) return { bool: { should: allFacetFilters } }
			return {}
		}

		const booleanFilters = facets
			.filter(f => f.type === FacetType.Boolean)
			.filter((facet: BooleanFacet) => facet.filters.size)
			.map(toFilter)

		const listFilters = facets
			.filter(f => f.type === FacetType.List)
			.filter((facet: ListFacet) => facet.filters.size)
			.map(toFilter)

		const rangeFilters = facets
			.filter(f => f.type === FacetType.Range)
			.filter((facet: RangeFacet) => Array.isArray(facet.filter) && facet.filter.length === 2)
			.map((facet: RangeFacet) => ({
				range: {
					[facet.field]: {
						gte: new Date(facet.filter[0]).toISOString(),
						lte: new Date(facet.filter[1]).toISOString()
					}
				}
			}))

		const filters = booleanFilters.concat(listFilters, rangeFilters as any)

		// if (!filters.length) {
		// 	this.post_filter = {}
		// } else if (filters.length === 1) {
		if (filters.length === 1) {
			this.post_filter = filters[0]
		} else if (filters.length > 1) {
			this.post_filter = {
				bool: {
					must: filters
				}
			}
		}
	}

	private addFilter(aggs: any): Record<'aggs', any> {
		const req: AggregationRequest = { aggs }
		if (this.post_filter != null) req.filter = this.post_filter
		return req
	}

	private createBooleanAggregation(facet: BooleanFacet) {
		const agg = {
			[facet.field]: {
				terms: {
					field: facet.field
				}
			},
		}

		return this.addFilter(agg)
	}

	private createListAggregation(facet: ListFacet) {
		const terms = {
			field: facet.field,
			min_doc_count: 0,
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

		const listAggs = this.addFilter(agg)
		return listAggs
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

	private createHistogramAggregation(facet: RangeFacet): Record<string, any> {
		// const [min, max] = facet.values
		let histAgg = {
			[facet.field]: {
				auto_date_histogram: {
					// extended_bounds: { min, max },
					field: facet.field,
					// interval: "year",
					// min_doc_count: 0,
				}
			}
		} as any

		// if (this.post_filter != null) {
		// 	histAgg = {
		// 		aggs: {
		// 			[`${facet.field}_histogram`]: histAgg,
		// 		},
		// 		filter: this.post_filter
		// 	}
		// }

		return histAgg
	}
}

	// private createHistogramAggregation(facet: RangeFacet) {
	// 	let histAgg = {
	// 		date_histogram: {
	// 			extended_bounds: { min: facet.values.values[0], max: facet.values.values[1]},
	// 			field: facet.field,
	// 			min_doc_count: 0,
	// 			interval: "month",
	// 		}
	// 	} as any

	// 	if (Object.keys(this.post_filter).length) {
	// 		histAgg = {
	// 			aggs: {
	// 				[`${facet.field}_histogram`]: {
	// 					date_histogram: {
	// 						extended_bounds: { min: facet.values.values[0], max: facet.values.values[1]},
	// 						field: facet.field,
	// 						interval: "month",
	// 						min_doc_count: 0,
	// 					}
	// 				}
	// 			},
	// 			filter: this.post_filter
	// 		}
	// 	}

	// 	return histAgg
	// }
