interface AggregationRequest {
	aggs: any
	filter?: any
}

type Aggregations = { [id: string]: AggregationRequest }
type Highlight = { fields: { text: {} }, require_field_match: boolean }

interface ListAggregationTerms {
	field: string
	include?: string
	order?: { [sb in SortBy]?: SortDirection }
	size: number
}

export default class ElasticSearchRequest {
	aggs: Aggregations = {}
	highlight: Highlight
	post_filter: Record<string, any>
	query: Record<string, any>
	_source: AppProps['resultFields']

	constructor(options: ElasticSearchRequestOptions) {
		this.setPostFilter(options)
		this.setAggregations(options)
		this.setQuery(options)
		this.setSource(options)
	}

	private setPostFilter(options: ElasticSearchRequestOptions) {
		function toPostFilter(facet: FacetData) {
			const allFacetFilters = [...facet.filters].map(key => ({ term: { [facet.id]: key } }))
			if (allFacetFilters.length === 1) return allFacetFilters[0]
			else if (allFacetFilters.length > 1) return { bool: { should: allFacetFilters } }
			return {}
		}

		const post_filters = Array.from(options.facetsData.values())
			.filter(facet => facet.filters.size) // Only set post_filter where facet has filters (check if Set is empty)
			.map(facet => toPostFilter(facet))

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

	private setAggregations(options: ElasticSearchRequestOptions) {
		for (const facetData of options.facetsData.values()) {
			let facetAggs	
			if (facetData.datatype === EsDataType.Boolean) facetAggs = this.createBooleanAggregation(facetData)
			if (facetData.datatype === EsDataType.Keyword) facetAggs = this.createListAggregation(facetData)
			if (facetData.datatype === EsDataType.Date) facetAggs = this.createHistogramAggregation(facetData)

			if (facetAggs != null) {
				this.aggs = {
					...this.aggs,
					...facetAggs
				}
			}
		}
	}

	private addFilter(key: string, values: any): any {
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

	private createListAggregation(facetData: FacetData) {
		const terms: ListAggregationTerms = {
			field: facetData.id,
			size: facetData.viewSize,
		}

		if (facetData.sort != null) terms.order = { [facetData.sort.by]: facetData.sort.direction }
		if (facetData.query.length) terms.include = `.*${facetData.query}.*`
		
		const agg = {
			...this.addFilter(facetData.id, { terms }),
			...this.addFilter(`${facetData.id}-count`, {
				cardinality: {
					field: facetData.id
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

	private setQuery(options: ElasticSearchRequestOptions) {
		if (!options.query.length) return
		this.query = { query_string: { query: options.query } }
		this.highlight = { fields: { text: {} }, require_field_match: false }
	}

	private setSource(options: ElasticSearchRequestOptions) {
		if (!options.resultFields.length) return
		this._source = options.resultFields
	}
}
