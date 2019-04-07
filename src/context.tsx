import * as React from 'react'
import FacetsManager from './facets-manager'

export interface ContextState {
	cycle: number,
	facetsManager: FacetsManager,
}
export const defaultState: ContextState = {
	cycle: 0,
	facetsManager: null,
}

export default React.createContext(defaultState)