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

	constructor(facets: Facets = new Map(), query: string = '') {
		const facetList = Object.keys(facets).map(field => facets.get(field))
		const booleanFacets = facetList.filter(facet => facet.type === FacetType.Boolean) as BooleanFacet[]
		const listFacets = facetList.filter(facet => facet.type === FacetType.List) as ListFacet[]
		const rangeFacets = facetList.filter(facet => facet.type === FacetType.Range) as RangeFacet[]

		this.setPostFilter(booleanFacets, listFacets, rangeFacets)

		for (const listFacet of listFacets) {
			this.aggs[listFacet.id] = this.createListAggregation(listFacet)
		}

		for (const booleanFacet of booleanFacets) {
			this.aggs[booleanFacet.id] = this.createBooleanAggregation(booleanFacet)
		}

		for (const rangeFacet of rangeFacets) {
			this.aggs[rangeFacet.id] = this.createRangeAggregation(rangeFacet)
			this.aggs[`${rangeFacet.id}_histogram`] = this.createHistogramAggregation(rangeFacet) as any
		}

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

	private setPostFilter(booleanFacets: BooleanFacet[], listFacets: ListFacet[], rangeFacets: RangeFacet[]) {
		const booleanFilters: any[] = booleanFacets
			.filter(facet => facet.filters.size > 0)
			.map((facet: ListFacet) => {
				const filters = [...facet.filters].map(key => ({ term: { [facet.field]: key } }))
				if (filters.length === 1)		return filters[0]
				else if (filters.length > 1)	return { bool: { should: filters } }
				return {}
			})

		const listFilters: any[] = listFacets
			.filter(facet => facet.filters.size > 0)
			.map((facet: ListFacet) => {
				const filters = [...facet.filters].map(key => ({ term: { [facet.field]: key } }))
				if (filters.length === 1)		return filters[0]
				else if (filters.length > 1)	return { bool: { should: filters } }
				return {}
			})

		const rangeFilters: any[] = rangeFacets
			.filter(facet => Array.isArray(facet.filter) && facet.filter.length === 2)
			.map((facet: RangeFacet) =>
				({
					range: {
						[facet.field]: {
							gte: facet.filter[0],
							lte: facet.filter[1]
						}
					}
				})
			)

		const filters = listFilters.concat(rangeFilters, booleanFilters)

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