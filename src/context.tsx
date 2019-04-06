import * as React from 'react'
import FacetsManager from './facets-manager'

export interface ContextState {
	facetsManager: FacetsManager,
	response: any
}
export const defaultState: ContextState = {
	facetsManager: null,
	response: null
}

export default React.createContext(defaultState)