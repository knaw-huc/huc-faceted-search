/// <reference path="./types.d.ts" />

import * as React from 'react'
import styled from '@emotion/styled'
import ListFacet from './views/list-facet'
import Reset from './views/reset'
import ElasticSearchRequest from './io-manager/backends/elasticsearch/request-creator'
import { fetchSearchResults } from './io-manager'
import elasticSearchResponseParser from './io-manager/backends/elasticsearch/response-parser'

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


interface SortsReducerAction {
	type: 'set' | 'clear'
	field?: string
	by?: SortBy
	direction?: SortDirection
}
function facetSortsReducer(facetSorts: Sorts, action: SortsReducerAction) {
	switch(action.type) {
		case 'set': {
			const { by, direction } = action
			facetSorts.set(action.field, { by, direction })
			return new Map(facetSorts)
		}

		case 'clear': {
			return new Map()
		}
	}

	return facetSorts
}

interface FiltersReducerAction {
	type: 'add' | 'remove' | 'clear'
	field?: string
	value?: any
}
function filtersReducer(filters: Filters, action: FiltersReducerAction) {
	switch(action.type) {
		case 'add': {
			if (filters.has(action.field)) {
				filters.get(action.field).add(action.value)
				return new Map(filters)
			}

			filters.set(action.field, new Set([action.value]))
			return new Map(filters)
		}

		case 'remove': {
			if (filters.has(action.field)) {
				const values = filters.get(action.field) 
				values.delete(action.value)
				if (!values.size) filters.delete(action.field)
				return new Map(filters)
			}
			break
		}

		case 'clear': {
			return new Map()
		}
	}

	return filters
}

function useSearchResult(props: AppProps, filters: Filters, sorts: Sorts) {
	const [searchResult, setSearchResult] = React.useState(null)

	React.useEffect(() => {
		// const facets = React.Children.toArray(props.children) as React.ReactElement[]
		const searchRequest = new ElasticSearchRequest(props.fields, props.resultFields, filters, sorts)
		fetchSearchResults(props.url, searchRequest)
			.then(result => {
				const searchResponse = elasticSearchResponseParser(result, props.fields)
				setSearchResult(searchResponse)
			})
			.catch(err => {
				console.log(err)
			})
	}, [props.resultFields, props.url, filters])

	return searchResult
}

export default React.memo(function FacetedSearch(props: AppProps) {
	const [filters, filtersDispatch] = React.useReducer(filtersReducer, new Map())
	const [facetSorts, facetSortsDispatch] = React.useReducer(facetSortsReducer, new Map())
	const searchResult = useSearchResult(props, filters, facetSorts)

	return (
		<Wrapper
			className={props.className}
			disableDefaultStyle={props.disableDefaultStyle}
			id="huc-fs"
		>
			<aside>
				{/* <FullTextSearch autoSuggest={props.autoSuggest} /> */}
				<Reset onClick={() => filtersDispatch({ type: 'clear' })} />
				<div>
					{
						props.fields.map(facetConfig => {
							if (facetConfig.datatype === EsDataType.Keyword) {
								return (
									<ListFacet
										{...facetConfig}
										addFilter={(field: string, value: string) => filtersDispatch({ type: 'add', field, value })}
										key={facetConfig.id}
										filters={filters.get(facetConfig.id)}
										removeFilter={(field, value) => filtersDispatch({ type: 'remove', field, value })}
										sortListFacet={(field, by, direction) => facetSortsDispatch(({ type: 'set', field, by, direction }))}
										title={facetConfig.title || facetConfig.id.charAt(0).toUpperCase() + facetConfig.id.slice(1)}
										values={searchResult?.facetValues[facetConfig.id]}
									/>
								)
							} else {
								return null
							}

						})
						// 	})
						// })
					}
				</div>
			</aside>
			{/* <SearchResults
				pageNumber={this.ioManager.currentPage}
				goToPage={pageNumber => this.ioManager.goToPage(pageNumber, this.state.facetsManager.getFacets())}
				onClickResult={this.props.onClickResult}
				resultBodyComponent={this.state.ResultBodyComponent}
				resultBodyProps={this.props.resultBodyProps}
				resultsPerPage={this.props.resultsPerPage}
				state={this.state}
			/> */}
		</Wrapper>
	)
})

// export default class FacetedSearch extends React.PureComponent<AppProps> {
// 	render() {
// 		return <App {...this.props} />
// 	}

// 	addFilter(field: string, key: string) {
// 		this.state.facetsManager.reset()
// 		this.state.facetsManager.addFilter(field, key)
// 	}

// 	getPrevNext(id: string): [Hit, Hit] {
// 		return this.ioManager.getPrevNext(id)
// 	}

// 	getFilters() {
// 		return this.state.facetsManager.getFacets()
// 			.reduce((prev, curr) => {
// 				if (curr.filters == null) return prev
// 				prev[curr.field] = [...curr.filters]
// 				return prev
// 			}, {} as Record<string, any[]>)
// 	}
// }
