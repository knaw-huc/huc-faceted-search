import RangeManager from './range-manager'
import ListFacetManager from './list-manager'
import { SortBy, SortDirection, Facets } from '../models/facet'
import ElasticSearchRequest from '../models/elastic-search-request'
import ElasticSearchResponseParser, { ElasticSearchResponse } from '../models/elastic-search-response-parser'

export default class IOManager {
	private cache: {[key: string]: string} = {}
	private rangeManager = new RangeManager()
	private listManager = new ListFacetManager()
	private query: string = ''
	facetCount: number
	request: ElasticSearchRequest

	constructor(private url: string, private onChange: (response: ElasticSearchResponse, facets: Facets) => void) {}

	addListAggregation(field: string, index: number, size: number) {
		this.listManager.addFacet(field, index, size)
		this.dispatch()
	}

	addListAggregationQuery(field: string, query: string) {
		this.listManager.addQuery(field, query)
		this.dispatch()
	}

	addListFilter(field: string, key: string) {
		this.listManager.addFilter(field, key)
		this.dispatch()
	}

	removeListFilter(field: string, key: string) {
		this.listManager.removeFilter(field, key)
		this.dispatch()
	}

	sortListBy(field: string, sortBy: SortBy, direction: SortDirection) {
		this.listManager.sortBy(field, sortBy, direction)
		this.dispatch()
	}

	addRangeFacet(field: string, index: number) {
		this.rangeManager.addFacet(field, index)
		this.dispatch()
	}

	addRangeFilter(field: string, min: number, max :number) {
		this.rangeManager.addFilter(field, min, max)
		this.dispatch()
	}

	addQuery(query: string) {
		this.query = query
		this.dispatch()
	}

	reset() {
		this.query = ''
		this.listManager.reset()
		this.rangeManager.reset()
		this.dispatch()
	}

	setFacetCount(count: number) {
		this.facetCount = count
		this.dispatch()
	}

	viewMoreFacetValues(field: string) {
		this.listManager.facets[field].viewMore()
		this.dispatch()
	}

	viewLessFacetValues(field: string) {
		this.listManager.facets[field].viewLess()
		this.dispatch()
	}

	private async dispatch() {
		const facets = {
			...this.listManager.facets,
			...this.rangeManager.facets,
		}

		this.request = new ElasticSearchRequest(facets, this.query)

		if (
			this.facetCount == null ||
			Object.keys(facets).length !== this.facetCount
		) {
			return
		}

		const body = JSON.stringify(this.request)

		let response: ElasticSearchResponse
		if (this.cache.hasOwnProperty(body)) {
			response = JSON.parse(this.cache[body])
		} else {
			const fetchResponse = await fetch(this.url, {
				method: 'post',
				headers: { 'Content-Type': 'application/json' },
				body
			})	
			response = await fetchResponse.json()

			if (
				response == null ||
				!response.hasOwnProperty('aggregations')
			) return

			this.cache[body] = JSON.stringify(response)
		}


		const responseParser = new ElasticSearchResponseParser(response, facets)

		this.onChange(response, responseParser.facets)
	}
}
