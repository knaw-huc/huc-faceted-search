import * as React from 'react'
import FacetsView from './facets'
import ListFacet from './list-facet'
import RangeFacetView from './range-facet'
import FullTextSearch from './full-text-search'
import Context, { defaultState, ContextState } from './context'
import styled from 'react-emotion'
import IOManager from './io-manager'
import Reset from './reset'
import ElasticSearchRequest from './models/elastic-search-request'
import { ElasticSearchResponse } from './models/elastic-search-response-parser';
import { Facets } from './models/facet';

export {
	FacetsView as Facets,
	FullTextSearch,
	ListFacet,
	RangeFacetView as RangeFacet,
	Reset,
}

const Wrapper = styled('div')`
	font-family: sans-serif;
`

interface Props {
	onChange: (request: ElasticSearchRequest, response: ElasticSearchResponse) => void
	url: string
}
export default class FacetedSearch extends React.PureComponent<Props, ContextState> {
	private handleChange = (response: ElasticSearchResponse, facets: Facets) => {
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
