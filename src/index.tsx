/// <reference path="./types.d.ts" />

import * as React from 'react'
import styled from '@emotion/styled'
import ListFacet from './views/list-facet'
import Reset from './views/reset'
import ElasticSearchRequest from './io-manager/backends/elasticsearch/request-creator'
import { fetchSearchResults } from './io-manager'
import elasticSearchResponseParser from './io-manager/backends/elasticsearch/response-parser'
import facetsDataReducer, { facetsDataReducerInit } from './reducers/facets-data'
import FullTextSearch from './views/full-text-search'

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

function useSearchResult(url: string, options: ElasticSearchRequestOptions) {
	const [searchResult, setSearchResult] = React.useState(null)

	React.useEffect(() => {
		const searchRequest = new ElasticSearchRequest(options)

		fetchSearchResults(url, searchRequest)
			.then(result => {
				const searchResponse = elasticSearchResponseParser(result, options.facetsData)
				setSearchResult(searchResponse)
			})
			.catch(err => {
				console.log(err)
			})
	}, [url, options.resultFields, options.facetsData, options.query])

	return searchResult
}

function FacetedSearch(props: AppProps) {
	const [query, setQuery] = React.useState('')
	const [facetsData, facetsDataDispatch] = React.useReducer(facetsDataReducer, props.fields, facetsDataReducerInit)

	const searchResult = useSearchResult(props.url, {
		facetsData,
		resultFields: props.resultFields,
		query,
	})

	return (
		<Wrapper
			className={props.className}
			disableDefaultStyle={props.disableDefaultStyle}
			id="huc-fs"
		>
			<aside>
				<FullTextSearch
					autoSuggest={props.autoSuggest}
					setQuery={setQuery}
				/>
				<Reset
					onClick={() => {
						setQuery('')
						facetsDataDispatch({ type: 'clear' })
					}}
				/>
				<div>
					{
						facetsData != null &&
						props.fields.map(facetConfig => {
							if (facetConfig.datatype === EsDataType.Keyword) {
								const values = searchResult?.facetValues[facetConfig.id]
								return (
									<ListFacet
										addFacetQuery={value => facetsDataDispatch({ type: 'set_query', facetId: facetConfig.id, value })}
										addFilter={value => facetsDataDispatch({ type: 'add_filter', facetId: facetConfig.id, value })}
										facetData={facetsData.get(facetConfig.id)}
										key={facetConfig.id}
										removeFilter={value => facetsDataDispatch({ type: 'remove_filter', facetId: facetConfig.id, value })}
										sortListFacet={(by, direction) => facetsDataDispatch(({ type: 'set_sort', facetId: facetConfig.id, by, direction }))}
										values={values}
										viewLess={() => facetsDataDispatch({ type: 'view_less', facetId: facetConfig.id })}
										viewMore={() => facetsDataDispatch({ type: 'view_more', facetId: facetConfig.id, total: values?.total })}
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
}

FacetedSearch.defaultProps = {
	resultFields: [],
	resultsPerPage: 10,
}

export default React.memo(FacetedSearch)

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





// interface FacetQueriesReducerAction {
// 	type: 'set' | 'clear'
// 	field?: string
// 	value?: string
// }
// function facetQueriesReducer(facetQueries: Map<string, string>, action: FacetQueriesReducerAction): Map<string, string> {
// 	switch(action.type) {
// 		case 'set': {
// 			facetQueries.set(action.field, action.value)
// 			return new Map(facetQueries)
// 		}

// 		case 'clear': {
// 			return new Map()
// 		}
// 	}

// 	return facetQueries
// }

// interface SortsReducerAction {
// 	type: 'set' | 'clear'
// 	field?: string
// 	by?: SortBy
// 	direction?: SortDirection
// }
// function facetSortsReducer(facetSorts: Sorts, action: SortsReducerAction) {
// 	switch(action.type) {
// 		case 'set': {
// 			const { by, direction } = action
// 			facetSorts.set(action.field, { by, direction })
// 			return new Map(facetSorts)
// 		}

// 		case 'clear': {
// 			return new Map()
// 		}
// 	}

// 	return facetSorts
// }

// interface FiltersReducerAction {
// 	type: 'add' | 'remove' | 'clear'
// 	field?: string
// 	value?: any
// }
// function filtersReducer(filters: Filters, action: FiltersReducerAction) {
// 	switch(action.type) {
// 		case 'add': {
// 			if (filters.has(action.field)) {
// 				filters.get(action.field).add(action.value)
// 				return new Map(filters)
// 			}

// 			filters.set(action.field, new Set([action.value]))
// 			return new Map(filters)
// 		}

// 		case 'remove': {
// 			if (filters.has(action.field)) {
// 				const values = filters.get(action.field) 
// 				values.delete(action.value)
// 				if (!values.size) filters.delete(action.field)
// 				return new Map(filters)
// 			}
// 			break
// 		}

// 		case 'clear': {
// 			return new Map()
// 		}
// 	}

// 	return filters
// }
