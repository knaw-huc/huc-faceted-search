import * as React from 'react'
import FacetsView from './views/facets'
import ListFacet from './views/list-facet'
import RangeFacetView from './views/range-facet'
import FullTextSearch from './views/full-text-search'
import Context, { defaultState, ContextState } from './context'
import styled from 'react-emotion'
import FacetsManager from './facets-manager'
import Reset from './views/reset'
import { Facets } from './models/facet'
import IOManager from './io-manager'
import { BackendType } from './backends'

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
	backend: BackendType
	onChange: (request: any, response: any, query: string) => void
	url: string
}
export default class FacetedSearch extends React.PureComponent<Props, ContextState> {
	state: ContextState
	ioManager: IOManager

	static defaultProps: Partial<Props> = {
		backend: 'none'
	}

	constructor(props: Props) {
		super(props)

		this.ioManager = new IOManager({ backend: this.props.backend, url: props.url })

		this.state = {
			...defaultState,
			facetsManager: new FacetsManager(this.handleChange)
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

	private handleChange = async (inputFacets: Facets, query: string) => {
		const { facets, response } = await this.ioManager.dispatch(inputFacets, query)
		this.setState({ facets, response })
		this.props.onChange(this.ioManager.requestBody, response, query)
	}
}
