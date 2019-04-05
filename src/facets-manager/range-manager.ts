import { RangeFacet } from '../models/facet';

import FacetManager from './facet-manager'

export default class RangeManger extends FacetManager<RangeFacet> {
	addFacet(field: string, index: number) {
		this.facets.set(field, new RangeFacet(field, index))
		this.change()
	}

	addFilter(field: string, min: number, max: number) {
		this.facets.get(field).filter = [min, max]
		this.change()
	}

	reset() {
		for (const field of Object.keys(this.facets)) {
			this.facets.set(field, new RangeFacet(field, this.facets.get(field).index))
		}
	}
}