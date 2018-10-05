import { RangeFacet } from '../models/facet';

export default class RangeManger {
	facets: { [key: string]: RangeFacet } = {}

	addFacet(field: string, index: number) {
		this.facets[field] = new RangeFacet(field, index)
	}

	addFilter(field: string, min: number, max: number) {
		this.facets[field].filter = [min, max]
	}

	reset() {
		for (const field of Object.keys(this.facets)) {
			this.facets[field] = new RangeFacet(field, this.facets[field].index)
		}
	}
}