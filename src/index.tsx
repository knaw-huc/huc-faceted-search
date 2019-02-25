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
import { Facets } from './models/facet'
import IOManager from './io-manager'
import { BackendType } from './backends'

export {
	BooleanFacet,
	FacetsView as Facets,
	FullTextSearch,
	ListFacet,
	RangeFacet,
	Reset,
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

	async getNext() {
		const { request, response, query } = await this.ioManager.getNext()
		this.setState({ response })
		this.props.onChange(request, response, query)

	}

	private handleChange = async (inputFacets: Facets, query: string) => {
		const { facets, request, response } = await this.ioManager.dispatch(inputFacets, query)
		this.setState({ facets, response })
		this.props.onChange(request, response, query)
	}
}
