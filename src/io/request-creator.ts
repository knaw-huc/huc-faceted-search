import { isBooleanFacet, isListFacet, isRangeFacet } from '../reducers/facets-data'

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
	_source: AppProps['resultFields']
	aggs: Aggregations = {}
	from: number
	highlight: Highlight
	post_filter: Record<string, any>
	query: Record<string, any>
	size: number
	sort: any

	constructor(options: ElasticSearchRequestOptions) {
		this.setPostFilter(options)
		this.setAggregations(options)
		this.setQuery(options)
		this.setSource(options)
		this.size = options.resultsPerPage
		if (options.currentPage > 1) this.from = this.size * (options.currentPage - 1) 
		if (options.sortOrder.size) {
			this.sort = []
			options.sortOrder.forEach((sortDirection, facetId) => {
				this.sort.push({[facetId]: sortDirection})
			})
			this.sort.push('_score')
		}
	}

	private setPostFilter(options: ElasticSearchRequestOptions) {
		function toPostFilter(facet: FacetData) {
			const allFacetFilters = [...facet.filters].map(key => ({ term: { [facet.id]: key } }))
			if (allFacetFilters.length === 1) return allFacetFilters[0]
			else if (allFacetFilters.length > 1) return { bool: { should: allFacetFilters } }
			return {}
		}

		const facetsData = Array.from(options.facetsData.values())

		const BooleanAndListPostFilters = facetsData
			.filter(facet => (isBooleanFacet(facet) || isListFacet(facet)) && facet.filters.size) // Only set post_filter where facet has filters (check if Set is empty)
			.map(facet => toPostFilter(facet))

		const RangePostFilters = facetsData
			.filter(isRangeFacet)
			.filter(facetData => facetData.filters.size === 2)
			.map(facet => ({
				range: {
					[facet.id]: {
						gte: new Date([...facet.filters][0]).toISOString(),
						lte: new Date([...facet.filters][1]).toISOString()
					}
				}
			}))

		const post_filters = BooleanAndListPostFilters.concat(RangePostFilters as any[])

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
			if (isBooleanFacet(facetData)) facetAggs = this.createBooleanAggregation(facetData)
			if (isListFacet(facetData)) facetAggs = this.createListAggregation(facetData)
			if (isRangeFacet(facetData)) facetAggs = this.createHistogramAggregation(facetData)

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

	private createBooleanAggregation(facet: BooleanFacetConfig) {
		const values = {
			terms: {
				field: facet.id
			}
		}

		return this.addFilter(facet.id, values)
	}

	private createListAggregation(facetData: ListFacetData) {
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

	private createHistogramAggregation(facet: RangeFacetData): Record<string, any> {
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
