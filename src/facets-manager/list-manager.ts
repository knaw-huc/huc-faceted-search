import { ListFacet, SortDirection, SortBy } from '../models/facet'
import FacetManager from './facet-manager'

export default class ListFacetManager extends FacetManager<ListFacet> {
	addFacet(field: string, index: number, size: number) {
		this.facets[field] = new ListFacet(field, index, size)
		this.change()
	}

	addFilter(field: string, key: string) {
		this.facets[field].filters.add(key)
		this.change()
	}

	removeFilter(field: string, key: string) {
		this.facets[field].filters.delete(key)
		this.change()
	}

	addQuery(field: string, query: string) {
		this.facets[field].query = query
		this.change()
	}

	sortBy(field: string, sortBy: SortBy, direction: SortDirection) {
		this.facets[field].order = [sortBy, direction]
		this.change()
	}

	reset() {
		for (const field of Object.keys(this.facets)) {
			this.facets[field] = new ListFacet(field, this.facets[field].index, this.facets[field].size)
		}
	}

	viewLess(field: string) {
		this.facets[field].viewLess()
		this.change()
	}

	viewMore(field: string) {
		this.facets[field].viewMore()
		this.change()
	}
}
