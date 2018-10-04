import RangeManager, { IRangeFacet } from './range-manager'
import ListManager, { IListFacet, SortBy, SortDirection } from './list-manager'

export class Request {
	aggs: { [id: string]: AggregationRequest } = {}
	post_filter: any = {}
	query: any
	size: number = 20
	sort: string = 'date'
}

interface Hit {
	// sort: number[]
	// _id: string
	// _index: string
	// _score: number
	_source: any
	// _type: string
}
export interface Response {
	aggregations: { [id: string]: any}
	hits: {
		hits: Hit[]
		// max_score: number
		total: number
	}
	// timed_out: boolean
	// took: number
}

export interface AggregationRequest {
	aggs: any
	filter: any
}

export enum FacetType {
	List,
	Range,
}
export interface IFacet {
	field: string
	type: FacetType
}

export type IFacets = { [id: string]: IListFacet | IRangeFacet }

export default class IOManager {
	private cache: {[key: string]: string} = {}
	private rangeManager = new RangeManager()
	private listManager = new ListManager()
	facetCount: number
	request: Request = new Request()

	constructor(private url: string, private onChange: (response: Response, facets: IFacets) => void) {}

	addListAggregation(id: string, field: string, size: number) {
		this.listManager.addFacet(id, field, size)
		this.dispatch()
	}

	addListAggregationQuery(id: string, field: string, query: string) {
		this.listManager.addQuery(id, field, query)
		this.dispatch()
	}

	addListFilter(field: string, key: string) {
		this.listManager.addFilter(field, key)
		this.setFilters()
	}

	removeListFilter(field: string, key: string) {
		this.listManager.removeFilter(field, key)
		this.setFilters()
	}

	sortListBy(id: string, field: string, sortBy: SortBy, direction: SortDirection) {
		this.listManager.sortBy(id, field, sortBy, direction)
		this.dispatch()
	}

	addRangeFacet(id: string, field: string) {
		this.rangeManager.addFacet(id, field)
		this.dispatch()
	}

	addRangeFilter(field: string, min: number, max :number) {
		this.rangeManager.addFilter(field, min, max)
		this.setFilters()
	}

	addQuery(query: string) {
		this.request.query = { query_string: { query } }
		if (!query.length) delete this.request.query
		this.dispatch()
	}

	reset() {
		this.request = new Request()
		this.listManager.reset()
		this.rangeManager.reset()
		this.dispatch()
	}

	setFacetCount(count: number) {
		this.facetCount = count
		this.dispatch()
	}

	viewMoreFacetValues(id: string, field: string, size: number) {
		const lastResponse = JSON.parse(this.cache[JSON.stringify(this.request)])
		const maxSize = lastResponse.aggregations[id][`${field}-count`].value	

		this.request.aggs[id].aggs[field].terms.size += size

		if (this.request.aggs[id].aggs[field].terms.size > maxSize) {
			this.request.aggs[id].aggs[field].term.size = maxSize
		}

		this.dispatch()
	}

	viewLessFacetValues(id: string, field: string, size: number) {
		this.request.aggs[id].aggs[field].terms.size -= size

		if (this.request.aggs[id].aggs[field].terms.size < size) {
			this.request.aggs[id].aggs[field].term.size = size
		}

		this.dispatch()
	}

	private async dispatch() {
		this.request.aggs = {
			...this.listManager.aggregations,
			...this.rangeManager.aggregations
		}

		const facets = {
			...this.listManager.facets,
			...this.rangeManager.facets,
		}

		if (
			this.facetCount == null ||
			Object.keys(facets).length !== this.facetCount
		) {
			return
		}

		const body = JSON.stringify(this.request)

		let response: Response
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


		this.listManager.updateFacets(response)
		this.rangeManager.updateFacets(response)

		this.onChange(response, facets)
	}

	private prepareFilters(manager: ListManager | RangeManager) {
		let filters

		if (manager.filters.length === 0) {
			filters = {}
		} else if (manager.filters.length === 1) {
			filters = manager.filters[0]
		} else {
			filters = {
				bool: {
					should: manager.filters
				}
			}
		}

		return filters
	}

	private setFilters() {
		let listFilters = this.prepareFilters(this.listManager)
		let rangeFilters = this.prepareFilters(this.rangeManager)
		let post_filter

		if (this.listManager.filters.length && this.rangeManager.filters.length) {
			post_filter = {
				bool: {
					must: [rangeFilters].concat(listFilters)
				}
			}
		} else if (this.listManager.filters.length && !this.rangeManager.filters.length) {
			post_filter = listFilters
		} else if (!this.listManager.filters.length && this.rangeManager.filters.length) {
			post_filter = rangeFilters
		}

		this.request.post_filter = post_filter
		this.dispatch()
	}
}
