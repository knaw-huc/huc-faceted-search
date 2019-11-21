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
	_source: IOOptions['resultFields']

	constructor(facets: Facet[], facetsManagerQuery: string, public size: number, resultFields: IOOptions['resultFields']) {
		this.setPostFilter(facets)
		this.setAggregations(facets)
		this.setQuery(facetsManagerQuery)
		this.setSource(resultFields)
	}

	private setSource(resultFields: IOOptions['resultFields']) {
		if (resultFields == null || !resultFields.length) return
		this._source = resultFields
	}

	private setQuery(query: string) {
		if (!query.length) return
		this.query = { query_string: { query } }
		this.highlight = { fields: { text: {} }, require_field_match: false }
	}

	private setAggregations(facets: Facet[]) {
		facets.filter(f => f.type === FacetType.Boolean)
			.forEach((facet: BooleanFacet) => {
				this.aggs = {
					...this.aggs,
					...this.createBooleanAggregation(facet),
				}
			})

		facets.filter(f => f.type === FacetType.List)
			.forEach((facet: ListFacet) => {
				this.aggs = {
					...this.aggs,
					...this.createListAggregation(facet)
				}
			})

		facets.filter(f => f.type === FacetType.Range)
			.forEach((facet: RangeFacet) => {
				this.aggs = {
					...this.aggs,
					...this.createHistogramAggregation(facet)
				}
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
			.filter((facet: RangeFacet) => Array.isArray(facet.filters) && facet.filters.length === 2)
			.map((facet: RangeFacet) => ({
				range: {
					[facet.field]: {
						gte: new Date(facet.filters[0]).toISOString(),
						lte: new Date(facet.filters[1]).toISOString()
					}
				}
			}))

		const filters = booleanFilters.concat(listFilters, rangeFilters as any)

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

	private addFilter(key: any, values: any): any {
		const agg = {
			[key]: {
				aggs: { [key]: values },
				filter: { match_all: {} }
			}
		}

		if (this.post_filter != null) {
			// @ts-ignore
			agg[key].filter = this.post_filter
		}

		return agg
	}

	private createBooleanAggregation(facet: BooleanFacet) {
		const values = {
				terms: {
					field: facet.field
				}
			}

		return this.addFilter(facet.field, values)
	}

	private createListAggregation(facet: ListFacet) {
		const terms = {
			field: facet.field,
			size: facet.viewSize,
		}

		if (facet.query.length) (terms as any).include = `.*${facet.query}.*`
		
		const agg = {
			...this.addFilter(facet.field, { terms }),
			...this.addFilter(`${facet.field}-count`, {
				cardinality: {
					field: facet.field
				}
			})
		}

		return agg
	}

	private createHistogramAggregation(facet: RangeFacet): Record<string, any> {
		const values = {
			auto_date_histogram: {
				field: facet.field,
			}
		}

		return this.addFilter(facet.field, values)
	}
}
