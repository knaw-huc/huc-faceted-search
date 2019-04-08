import * as React from 'react'
import FacetManager from './facets-manager'

export interface ContextState {
	cycle: number,
	facetsManager: FacetManager,
}
export const defaultState: ContextState = {
	cycle: 0,
	facetsManager: null,
}

export default React.createContext(defaultState)