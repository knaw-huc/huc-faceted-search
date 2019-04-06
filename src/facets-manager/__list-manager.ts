import { ListFacet, SortDirection, SortBy } from '../models/facet'
import FacetManager from './facet-manager'

export default class ListFacetManager extends FacetManager<ListFacet> {
	addFacet(field: string, index: number, size: number) {
		this.facets.set(field, new ListFacet(field, index, size))
		this.change()
	}

	addFilter(field: string, key: string) {
		this.facets.get(field).filters.add(key)
		this.change()
	}

	removeFilter(field: string, key: string) {
		this.facets.get(field).filters.delete(key)
		this.change()
	}

	addQuery(field: string, query: string) {
		this.facets.get(field).query = query
		this.change()
	}

	sortBy(field: string, sortBy: SortBy, direction: SortDirection) {
		this.facets.get(field).order = [sortBy, direction]
		this.change()
	}

	reset() {
		for (const [field, facet] of this.facets) {
			this.facets.set(field, new ListFacet(field, facet.index, facet.size))
		}
	}

	viewLess(field: string) {
		this.facets.get(field).viewLess()
		this.change()
	}

	viewMore(field: string) {
		this.facets.get(field).viewMore()
		this.change()
	}
}
