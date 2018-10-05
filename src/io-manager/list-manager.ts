import { ListFacet, SortDirection, SortBy } from '../models/facet'

export default class ListFacetManager {
	facets: { [field: string]: ListFacet } = {}

	addFacet(field: string, index: number, size: number) {
		this.facets[field] = new ListFacet(field, index, size)
	}

	addFilter(field: string, key: string) {
		this.facets[field].filters.add(key)
	}

	removeFilter(field: string, key: string) {
		this.facets[field].filters.delete(key)
	}

	reset() {
		for (const field of Object.keys(this.facets)) {
			this.facets[field] = new ListFacet(field, this.facets[field].index, this.facets[field].size)
		}
	}

	addQuery(field: string, query: string) {
		this.facets[field].query = query
	}

	sortBy(field: string, sortBy: SortBy, direction: SortDirection) {
		this.facets[field].order = [sortBy, direction]
	}
}
