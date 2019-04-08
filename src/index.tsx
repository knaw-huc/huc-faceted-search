/// <reference path="./types.d.ts" />

import * as React from 'react'
import Context, { defaultState, ContextState } from './context'
import styled from '@emotion/styled'
import FacetsView from './views/facets'
import ListFacet from './views/list-facet'
import RangeFacet from './views/range-facet'
import BooleanFacet from './views/boolean-facet'
import FullTextSearch from './views/full-text-search'
import FacetManager from './facets-manager'
import Reset from './views/reset'
import SearchResults from './search-results'
import IOManager from './io-manager'

export {
	BooleanFacet,
	FacetsView as Facets,
	FullTextSearch,
	ListFacet,
	RangeFacet,
	Reset,
	SearchResults
}

const Wrapper = styled('div')`
	font-family: sans-serif;
`

interface Props {
	backend?: BackendType
	onChange: (response: OnChangeResponse) => void
	url: string
}
export default class FacetedSearch extends React.PureComponent<Props, ContextState> {
	state: ContextState = {
		...defaultState,
		facetsManager: new FacetManager()
	}
	private ioManager: IOManager

	static defaultProps: Partial<Props> = {
		backend: 'none'
	}

	constructor(props: Props) {
		super(props)

		this.ioManager = new IOManager({ backend: props.backend, url: props.url }, this.state.facetsManager)
		this.ioManager.onChange = (response: OnChangeResponse) => {
			props.onChange(response)
			this.setState({ cycle: this.state.cycle++ })
		}
	}

	render() {
		return (
			<Context.Provider value={this.state}>
				<Wrapper>
					{this.props.children}
				</Wrapper>
			</Context.Provider>
		)
	}

	addFilter(field: string, key: string) {
		this.state.facetsManager.addFilter(field, key)
	}

	async getNext() {
		await this.ioManager.getNext()
	}
}