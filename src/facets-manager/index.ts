import { Facets, FacetType, BooleanFacet, ListFacet, RangeFacet, SortBy, SortDirection } from '../models/facet'
import FacetGetters from './getters'

const facetByType: Record<FacetType, any> = {
	[FacetType.Boolean]: BooleanFacet,
	[FacetType.List]: ListFacet,
	[FacetType.Range]: RangeFacet,
}

export default class FacetsManager extends FacetGetters {
	query: string = ''
	facetCount: number

	constructor(private onChange: (facets: Facets, query: string) => void) {
		super()
	}

	addFacet(type: FacetType, field: string, index: number, thirdArg?: any): void {
		this.facets.set(field, new facetByType[type](field, index, thirdArg))
		this.handleChange()
	}

	addFilter(field: string, key: string): void // ListFacet || BooleanFacet
	addFilter(field: string, key: number, max: number): void // RangeFacet
	addFilter(field: string, key: string | number, max?: number): void {
		const facet = this.facets.get(field)
		if (facet.type === FacetType.Range && typeof key === 'number') (facet as RangeFacet).filter = [key, max]
		else if (facet.type === FacetType.Boolean && typeof key === 'string') (facet as BooleanFacet).filters.add(key)
		else if (facet.type === FacetType.List && typeof key === 'string') (facet as ListFacet).filters.add(key)
		this.handleChange()
	}

	// Remove filter works on ListFacet and BooleanFacet
	removeFilter(field: string, key: string) {
		this.getListFacet(field).filters.delete(key)
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

	viewLess(field: string) {
		this.getListFacet(field).viewLess()
		this.handleChange()
	}

	viewMore(field: string) {
		this.getListFacet(field).viewMore()
		this.handleChange()
	}

	addQuery(query: string) {
		this.query = query
		this.handleChange()
	}

	reset() {
		this.query = ''
		for (const [field, facet] of this.facets) {
			const nextFacet = new facetByType[facet.type]()
			this.facets.set(field, nextFacet)
		}
		this.handleChange()
	}

	setFacetCount(count: number) {
		this.facetCount = count
		this.handleChange()
	}

	// setValue(field: string, key: string) {

	// }

	private handleChange() {
		// const facets: Facets = new Map()
		// this.allManagers().forEach(m => m.facets.forEach(facet => facets.set(facet.field, facet)))

		if (this.facetCount == null || this.facets.size !== this.facetCount) return

		this.onChange(new Map(this.facets), this.query)
	}

	// private allManagers() {
	// 	return Object.keys(this.managers).map(m => (this.managers as Record<string, FacetManager<any>>)[m])
	// }
}
