import { BooleanFacet } from '../models/facet';

import FacetManager from './facet-manager'

export default class BooleanManager extends FacetManager<BooleanFacet> {
	addFacet(field: string, index: number) {
		this.facets.set(field, new BooleanFacet(field, index))
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

	reset() {
		for (const [field, facet] of this.facets) {
			this.facets.set(field, new BooleanFacet(field, facet.index))
		}
	}
}