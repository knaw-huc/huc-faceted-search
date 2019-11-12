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

const Wrapper = styled.div`
	margin-bottom: 10vh;

	${(props: { disableDefaultStyle: boolean}) => {
		if (!props.disableDefaultStyle) {
			return `
				display: grid;
				font-family: sans-serif;
				grid-template-columns: minmax(32px, auto) 352px minmax(320px, 672px) minmax(32px, auto);
				
				& > aside {
					grid-column: 2;
					padding-right: 32px;
				}

				& > section {
					grid-column: 3;
					padding-left: 32px;
				}
			`
		}
	}}
`

interface Props {
	backend?: BackendType
	className?: string
	disableDefaultStyle?: boolean
	onChange?: (response: OnChangeResponse) => void
	onClickResult: (result: any, ev: React.MouseEvent<HTMLLIElement>) => void
	resultBodyComponent: React.SFC<ResultBodyProps>
	resultBodyProps?: Record<string, any>
	resultsPerPage?: number
	url: string
}
export default class FacetedSearch extends React.PureComponent<Props, ContextState> {
	state: ContextState = {
		...defaultState,
		facetsManager: new FacetManager({
			onChange: () => this.ioManager.sendRequest(this.state.facetsManager.getFacets(), this.state.facetsManager.query)
		})
	}
	private ioManager: IOManager

	static defaultProps: Partial<Props> = {
		backend: 'none',
		disableDefaultStyle: false,
		onChange: () => {},
		resultsPerPage: 10,
		resultBodyProps: {}
	}

	constructor(props: Props) {
		super(props)

		this.ioManager = new IOManager({
			backend: props.backend,
			resultsPerPage: props.resultsPerPage,
			url: props.url,
			onChange: (changeResponse: Pick<OnChangeResponse, 'request' | 'response'>) => {
				this.state.facetsManager.update(changeResponse.response)
				props.onChange({ ...changeResponse, query: this.state.facetsManager.query})
				this.setState({ searchResult: changeResponse.response })
			}
		})
	}

	render() {
		return (
			<Context.Provider value={this.state}>
				<Wrapper
					className={this.props.className}
					disableDefaultStyle={this.props.disableDefaultStyle}
					id="huc-fs"
				>
					<aside>
						<FullTextSearch autoSuggest={async () => []} />
						<Reset />
						<FacetsView>
							{this.props.children}
						</FacetsView>
					</aside>
					<SearchResults
						pageNumber={this.ioManager.currentPage}
						goToPage={pageNumber => this.ioManager.goToPage(pageNumber, this.state.facetsManager.getFacets())}
						onClickResult={this.props.onClickResult}
						resultBodyComponent={this.props.resultBodyComponent}
						resultBodyProps={this.props.resultBodyProps}
						resultsPerPage={this.props.resultsPerPage}
						state={this.state}
					/>
				</Wrapper>
			</Context.Provider>
		)
	}

	addFilter(field: string, key: string) {
		console.log(field, key)
		this.state.facetsManager.addFilter(field, key)
	}

	getPrevNext(id: string): [Hit, Hit] {
		return this.ioManager.getPrevNext(id)
	}

	// async getNext() {
	// 	await this.ioManager.getNext()
	// }
}
