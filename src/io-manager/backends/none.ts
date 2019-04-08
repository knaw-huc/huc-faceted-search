import { ListFacet, RangeFacet } from "../../models/facet"

export class NoneRequestCreator {
	constructor(public facets: Facets, public query: string) {}
}

export class NoneResponseParser {
	constructor(response: any, public facets: Facets) {
		Object.keys(facets)
			.forEach(field => {
				const facet = facets.get(field)
				facet.values = response[field].values
				if (facet.type === FacetType.List) {
					(facet as ListFacet).total = response[field].total
				}
				if (facet.type === FacetType.Range) {
					(facet as RangeFacet).histogramValues = response[field].histogramValues
				}
			})
	}
}