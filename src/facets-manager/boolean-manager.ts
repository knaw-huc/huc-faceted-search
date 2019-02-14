import { BooleanFacet } from '../models/facet';

import FacetManager from './facet-manager'

export default class BooleanManager extends FacetManager<BooleanFacet> {
	addFacet(field: string, index: number) {
		this.facets[field] = new BooleanFacet(field, index)
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

	reset() {
		for (const field of Object.keys(this.facets)) {
			this.facets[field] = new BooleanFacet(field, this.facets[field].index)
		}
	}
}