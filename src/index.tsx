import * as React from 'react'
import Facets from './facets'
import ListFacet from './list-facet'
import RangeFacet from './range-facet'
import FullTextSearch from './full-text-search'
import Context, { defaultState, ContextState } from './context'
import styled from 'react-emotion'
import IOManager, { Request, Response, IFacets } from './io-manager'
import Reset from './reset'

export {
	Facets,
	FullTextSearch,
	ListFacet,
	RangeFacet,
	Reset,
}

const Wrapper = styled('div')`
	font-family: sans-serif;
`

interface Props {
	onChange: (request: Request, response: Response) => void
	url: string
}
export default class FacetedSearch extends React.PureComponent<Props, ContextState> {
	private handleChange = (response: Response, facets: IFacets) => {
		this.setState({ facets, response })
		this.props.onChange(this.state.ioManager.request, response)
	}

	state: ContextState = {
		...defaultState,
		ioManager: new IOManager(this.props.url, this.handleChange)
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
}
