import { BooleanFacet, ListFacet, RangeFacet, FacetType, Facets, Facet } from '../models/facet';


// function isBooleanFacet(facetValue: [string, BooleanFacet | ListFacet | RangeFacet]): facetValue is [string, BooleanFacet] {
// 	return facetValue[1].type === FacetType.Boolean
// }

// function isListFacet(facetValue: [string, BooleanFacet | ListFacet | RangeFacet]): facetValue is [string, ListFacet] {
// 	return facetValue[1].type === FacetType.List
// }

// function isRangeFacet(facetValue: [string, BooleanFacet | ListFacet | RangeFacet]): facetValue is [string, RangeFacet] {
// 	return facetValue[1].type === FacetType.Range
// }

// function isOfType(type: FacetType.Range): (facetValue: [string, Facet]) => facetValue is [string, RangeFacet]
// function isOfType(type: FacetType.Boolean): (facetValue: [string, Facet]) => facetValue is [string, BooleanFacet]
// function isOfType(type: FacetType.List): (facetValue: [string, Facet]) => facetValue is [string, ListFacet]
function isOfType(type: FacetType): (facetValue: [string, Facet]) => facetValue is [string, Facet] {
	return function(facetValue: [string, Facet]): facetValue is [string, Facet] {
		return facetValue[1].type === type
	}
}

export default class FacetGetter {
	// TODO make private
	facets: Facets = new Map()

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

	// getBooleanFacets(): BooleanFacet[] {
	// 	return [...this.facets].filter(isBooleanFacet).map(f => f[1])
	// }

	getRangeFacet(field: string): RangeFacet {
		return this.facets.get(field) as RangeFacet
	}

	// getRangeFacets(): RangeFacet[] {
	// 	return [...this.facets].filter(isRangeFacet).map(f => f[1])
	// }

	getListFacet(field: string): ListFacet {
		return this.facets.get(field) as ListFacet
	}

	// getListFacets(): ListFacet[] {
	// 	return [...this.facets].filter(isListFacet).map(f => f[1])
	// }
}