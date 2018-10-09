import RangeManager from './range-manager'
import ListFacetManager from './list-manager'
import { Facets } from '../models/facet'

export default class FacetsManager {
	private query: string = ''

	facetCount: number
	listManager = new ListFacetManager()
	rangeManager = new RangeManager()
	request: any

	constructor(private onChange: (facets: Facets, query: string) => void) {
		this.listManager.onChange(() => this.handleChange())
		this.rangeManager.onChange(() => this.handleChange())
	}

	private handleChange() {
		const facets = {
			...this.listManager.facets,
			...this.rangeManager.facets,
		}

		if ( this.facetCount == null || Object.keys(facets).length !== this.facetCount) return

		this.onChange(facets, this.query)
	}

	addQuery(query: string) {
		this.query = query
		this.handleChange()
	}

	reset() {
		this.query = ''
		this.listManager.reset()
		this.rangeManager.reset()
		this.handleChange()
	}

	setFacetCount(count: number) {
		this.facetCount = count
		this.handleChange()
	}
}
