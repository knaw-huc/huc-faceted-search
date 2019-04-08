import * as React from 'react'
import FacetsView from './views/facets'
import ListFacet from './views/list-facet'
import RangeFacet from './views/range-facet'
import BooleanFacet from './views/boolean-facet'
import FullTextSearch from './views/full-text-search'
import Context, { defaultState, ContextState } from './context'
import styled from '@emotion/styled'
import FacetsManager from './facets-manager'
import Reset from './views/reset'
import IOManager from './io-manager'
import { BackendType } from './backends'
import SearchResults from './search-results'

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
	onChange: (request: any, response: any, query: string) => void
	url: string
}
export default class FacetedSearch extends React.PureComponent<Props, ContextState> {
	state: ContextState
	private ioManager: IOManager
	private facetsManager: FacetsManager

	static defaultProps: Partial<Props> = {
		backend: 'none'
	}

	constructor(props: Props) {
		super(props)

		this.facetsManager = new FacetsManager(this.handleChange)
		this.ioManager = new IOManager({ backend: this.props.backend, url: props.url }, this.facetsManager)

		this.state = {
			...defaultState,
			facetsManager: this.facetsManager
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
		this.facetsManager.addFilter(field, key)
	}

	async getNext() {
		const { request, response, query } = await this.ioManager.getNext()
		this.update(request, response, query)
	}

	private handleChange = async () => {
		const { request, response } = await this.ioManager.dispatch()
		this.update(request, response, this.facetsManager.query)
	}

	private update(request: any, response: any, query: string) {
		this.props.onChange(request, response, query)
		this.setState({ cycle: this.state.cycle++ })
	}
}
