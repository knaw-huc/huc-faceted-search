import * as React from 'react'
import FacetsManager from './facets-manager'

export interface ContextState {
	facetsManager: FacetsManager,
	searchResult: FSResponse
}
export const defaultState: ContextState = {
	facetsManager: null,
	searchResult: {
		facetValues: {},
		results: [],
		total: 0
	}
}

export default React.createContext(defaultState)
