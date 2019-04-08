import { BooleanFacet, ListFacet, RangeFacet } from '../models/facet'

function isOfType(type: FacetType): (facetValue: [string, Facet]) => facetValue is [string, Facet] {
	return function(facetValue: [string, Facet]): facetValue is [string, Facet] {
		return facetValue[1].type === type
	}
}

export default class FacetGetter {
	protected facets: Facets = new Map()
	facetCount: number
	query: string = ''
	onChange: OnFacetManagerChange

	getFacets(): Facet[]
	getFacets(type: FacetType.Boolean): BooleanFacet[]
	getFacets(type: FacetType.List): ListFacet[]
	getFacets(type: FacetType.Range): RangeFacet[]
	getFacets(type?: FacetType): Facet[] {
		// if (type == null) return this.facets
		return [...this.facets].filter(isOfType(type)).map(f => f[1])
	}

	getBooleanFacet(field: string): BooleanFacet {
		return this.facets.get(field) as BooleanFacet
	}

	getRangeFacet(field: string): RangeFacet {
		return this.facets.get(field) as RangeFacet
	}

	getListFacet(field: string): ListFacet {
		return this.facets.get(field) as ListFacet
	}

	setBooleanFacet(field: string, index: number, settings: BooleanSettings): void {
		this.facets.set(field, new BooleanFacet(field, index, settings))
		this.handleChange()
	}

	setListFacet(field: string, index: number, settings: ListSettings): void {
		this.facets.set(field, new ListFacet(field, index, settings))
		this.handleChange()
	}

	setRangeFacet(field: string, index: number, settings: RangeSettings): void {
		this.facets.set(field, new RangeFacet(field, index, settings))
		this.handleChange()
	}

	protected handleChange() {
		if (
			this.onChange == null ||
			this.facetCount == null ||
			this.facets.size !== this.facetCount
		) return
		this.facets = new Map(this.facets)
		this.onChange()
	}
}