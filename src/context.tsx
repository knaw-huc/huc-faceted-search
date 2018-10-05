import * as React from 'react'
import IOManager from './io-manager'
import { Facets } from './models/facet'
import { ElasticSearchResponse } from './models/elastic-search-response-parser'

export interface ContextState {
	facets: Facets,
	ioManager: IOManager,
	response: ElasticSearchResponse
}
export const defaultState: ContextState = {
	facets: null,
	ioManager: null,
	response: null
}

export default React.createContext(defaultState)