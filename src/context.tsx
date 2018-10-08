import * as React from 'react'
import FacetsManager from './facets-manager'
import { Facets } from './models/facet'
import { ElasticSearchResponse } from './models/elastic-search-response-parser'

export interface ContextState {
	facets: Facets,
	facetsManager: FacetsManager,
	response: ElasticSearchResponse
}
export const defaultState: ContextState = {
	facets: {},
	facetsManager: null,
	response: null
}

export default React.createContext(defaultState)