import { FacetType, ListFacet, RangeFacet, Facets } from './facet';

interface AggregationRequest {
	aggs: any
	filter: any
}

type Aggregations = { [id: string]: AggregationRequest }
export default class ElasticSearchRequest {
	aggs: Aggregations = {}
	post_filter: any = {}
	query: any
	size: number = 20
	sort: string = 'date'

	constructor(facets: Facets = {}, query: string = '') {
		const facetList = Object.keys(facets).map(field => facets[field])
		const listFacets = facetList.filter(facet => facet.type === FacetType.List) as ListFacet[]
		const rangeFacets = facetList.filter(facet => facet.type === FacetType.Range) as RangeFacet[]

		for (const listFacet of listFacets) {
			this.aggs[listFacet.id] = this.createListAggregation(listFacet)
		}

		for (const rangeFacet of rangeFacets) {
			this.aggs[rangeFacet.id] = this.createRangeAggregation(rangeFacet)
			this.aggs[`${rangeFacet.id}_histogram`] = this.createHistogramAggregation(rangeFacet) as any
		}

		this.setPostFilter(listFacets, rangeFacets)

		if (query.length) this.query = { query_string: { query }}
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
		
		return {
			aggs: {
				[facet.field]: { terms },
				[`${facet.field}-count`]: {
					cardinality: {
						field: facet.field
					}
				}
			},
			filter: {
				match_all: {}
			}
		}
	}

	private createRangeAggregation(facet: RangeFacet) {
		return {
			aggs: {
				[facet.field]: {
					stats: {
						field: facet.field,
					}
				},
			},
			filter: {
				match_all: {}
			}
		}
	}

	private createHistogramAggregation(facet: RangeFacet) {
		facet.field
		return {
			date_histogram: {
				field: "date",
				interval: "year",
			}
		}
	}

	private setPostFilter(listFacets: ListFacet[], rangeFacets: RangeFacet[]) {
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

		const filters = listFilters.concat(rangeFilters)

		if (filters.length === 1) {
			this.post_filter = filters[0]
		} else {
			this.post_filter = {
				bool: {
					must: filters
				}
			}

		}
	}
}