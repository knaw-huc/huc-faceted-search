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
	_source: AppProps['resultFields']

	// constructor(facets: Facet[], facetsManagerQuery: string, public size: number, resultFields: IOOptions['resultFields']) {
	constructor(fields: FacetConfig[], resultFields: AppProps['resultFields'], filters: Filters, sorts: Sorts) {
		this.setPostFilter(fields, filters)
		this.setAggregations(fields)
		// this.setQuery(facetsManagerQuery)
		this.setSource(resultFields)
	}

	private setSource(resultFields: AppProps['resultFields']) {
		if (resultFields == null || !resultFields.length) return
		this._source = resultFields
	}

	// private setQuery(query: string) {
	// 	if (!query.length) return
	// 	this.query = { query_string: { query } }
	// 	this.highlight = { fields: { text: {} }, require_field_match: false }
	// }

	private setAggregations(facets: FacetConfig[]) {
		facets.filter(f => f.datatype === EsDataType.Boolean)
			.forEach(facet => {
				this.aggs = {
					...this.aggs,
					...this.createBooleanAggregation(facet),
				}
			})

		facets.filter(f => f.datatype === EsDataType.Keyword)
			.forEach((facet) => {
				this.aggs = {
					...this.aggs,
					...this.createListAggregation(facet)
				}
			})

		facets.filter(f => f.datatype === EsDataType.Date)
			.forEach(facet => {
				this.aggs = {
					...this.aggs,
					...this.createHistogramAggregation(facet)
				}
			})
	}

	private setPostFilter(facets: FacetConfig[], filters: Filters) {
		function toPostFilter(field: string, values: Set<string>) {
			const allFacetFilters = [...values].map(key => ({ term: { [field]: key } }))
			if (allFacetFilters.length === 1) return allFacetFilters[0]
			else if (allFacetFilters.length > 1) return { bool: { should: allFacetFilters } }
			return {}
		}

		const post_filters = facets
			.filter(facet => filters.has(facet.id))
			.map(facet => toPostFilter(facet.id, filters.get(facet.id)))

		// const booleanFilters = facets
		// 	.filter(f => f.type === FacetType.Boolean)
		// 	.filter((facet: BooleanFacet) => facet.filters.size)
		// 	.map(toFilter)

		// const listFilters = facets
		// 	.filter(f => f.type === FacetType.List)
		// 	.filter((facet: ListFacet) => facet.filters.size)
		// 	.map(toFilter)

		// const rangeFilters = facets
		// 	.filter(f => f.type === FacetType.Range)
		// 	.filter((facet: RangeFacet) => Array.isArray(facet.filters) && facet.filters.length === 2)
		// 	.map((facet: RangeFacet) => ({
		// 		range: {
		// 			[facet.field]: {
		// 				gte: new Date(facet.filters[0]).toISOString(),
		// 				lte: new Date(facet.filters[1]).toISOString()
		// 			}
		// 		}
		// 	}))

		// const post_filters = booleanFilters.concat(listFilters, rangeFilters as any)

		if (post_filters.length === 1) {
			this.post_filter = post_filters[0]
		} else if (post_filters.length > 1) {
			this.post_filter = {
				bool: {
					must: post_filters
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

	private createBooleanAggregation(facet: FacetConfig) {
		const values = {
			terms: {
				field: facet.id
			}
		}

		return this.addFilter(facet.id, values)
	}

	private createListAggregation(facet: FacetConfig) {
		const terms = {
			field: facet.id,
			size: facet.size,
		}

		// if (facet.query.length) (terms as any).include = `.*${facet.query}.*`
		
		const agg = {
			...this.addFilter(facet.id, { terms }),
			...this.addFilter(`${facet.id}-count`, {
				cardinality: {
					field: facet.id
				}
			})
		}

		return agg
	}

	private createHistogramAggregation(facet: FacetConfig): Record<string, any> {
		const values = {
			auto_date_histogram: {
				field: facet.id,
			}
		}

		return this.addFilter(facet.id, values)
	}
}
