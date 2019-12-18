import FacetGetters from './getters'

export default class FacetsManager extends FacetGetters {
	addFilter(field: string, key: string): void // ListFacet || BooleanFacet
	addFilter(field: string, key: number, max: number): void // RangeFacet
	addFilter(field: string, key: string | number, max?: number): void {
		const facetType = this.facets.get(field).type

		if (facetType === FacetType.Range && typeof key === 'number') {
			const facet = this.getRangeFacet(field)

			const prevMin = facet.values[0].key
			const prevMax = facet.values[facet.values.length - 1].key

			if (prevMin !== key || prevMax !== max) {
				facet.filters = [key, max] 
				this.handleChange()
			}
		}
		else if (
			(facetType === FacetType.List || facetType === FacetType.Boolean) &&
			typeof key === 'string'
		) {
			const facet = this.getListFacet(field)
			if (!facet.filters.has(key)) {
				facet.filters.add(key)
				this.handleChange()
			}
		}
	}

	// Remove filter works on ListFacet and BooleanFacet
	removeFilter(field: string, key: string) {
		this.getListFacet(field).filters.delete(key)
		this.handleChange()
	}

	addQuery(query: string) {
		this.query = query
		this.handleChange()
	}

	sortListBy(field: string, sortBy: SortBy, direction: SortDirection) {
		this.getListFacet(field).order = [sortBy, direction]
		this.handleChange()
	}

	addListFilterQuery(field: string, query: string) {
		this.getListFacet(field).query = query
		this.handleChange()
	}

	// TODO move to Facet?
	viewLess(field: string) {
		this.getListFacet(field).viewLess()
		this.handleChange()
	}

	// TODO move to Facet?
	viewMore(field: string) {
		this.getListFacet(field).viewMore()
		this.handleChange()
	}

	reset() {
		this.query = ''
		this.getFacets().forEach(f => f.reset())
		this.handleChange()
	}

	setFacetCount(count: number) {
		this.facetCount = count
		this.handleChange()
	}

	update(response: FSResponse) {
		this.getFacets().forEach(facet => {
			facet.values = response.facetValues[facet.field]
		})
	}
}
