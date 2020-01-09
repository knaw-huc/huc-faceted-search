/// <reference path="./types/index.d.ts" />

import * as React from 'react'
import styled from '@emotion/styled'
import ListFacet from './views/facets/list'
import BooleanFacet from './views/facets/boolean'
import RangeFacet from './views/facets/range'
import Reset from './views/reset'
import ElasticSearchRequest from './io/request-creator'
import { fetchSearchResults, isBooleanFacet, isListFacet, isRangeFacet } from './constants'
import elasticSearchResponseParser from './io/response-parser'
import facetsDataReducer, { facetsDataReducerInit } from './reducers/facets-data'
import FullTextSearch from './views/full-text-search'
import SearchResult from './views/search-result'

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

const initialSearchResult: FSResponse = {
	facetValues: {},
	results: [],
	total: 0
}

function useSearchResult(url: string, options: ElasticSearchRequestOptions) {
	const [searchResult, setSearchResult] = React.useState(initialSearchResult)

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
	}, [url, ...Object.keys(options).map((opt: keyof ElasticSearchRequestOptions) => options[opt])])

	return searchResult
}

function FacetedSearch(props: AppProps) {
	const [query, setQuery] = React.useState('')
	const [currentPage, setCurrentPage] = React.useState(1)
	const [sortOrder, setSortOrder] = React.useState<SortOrder>(new Map())
	const [facetsData, facetsDataDispatch] = React.useReducer(facetsDataReducer, props.fields, facetsDataReducerInit)
	const searchResult = useSearchResult(props.url, {
		currentPage,
		facetsData,
		resultFields: props.resultFields,
		resultsPerPage: props.resultsPerPage,
		query,
		sortOrder,
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
						setSortOrder(new Map())
						facetsDataDispatch({ type: 'clear', fields: props.fields })
					}}
				/>
				<div>
					{
						Array.from(facetsData.values())
							.map(facetData => {
								const values = searchResult.facetValues[facetData.id]

								if (isListFacet(facetData)) {
									return (
										<ListFacet
											facetData={facetData as ListFacetData}
											facetsDataDispatch={facetsDataDispatch}
											key={facetData.id}
											values={values as ListFacetValues}
										/>
									)
								}
								else if (isBooleanFacet(facetData)) {
									return (
										<BooleanFacet
											facetData={facetData as BooleanFacetData}
											facetsDataDispatch={facetsDataDispatch}
											key={facetData.id}
											values={values as BooleanFacetValues}
										/>
									)
								}
								else if (isRangeFacet(facetData)) {
									return (
										<RangeFacet
											facetData={facetData as RangeFacetData}
											facetsDataDispatch={facetsDataDispatch}
											key={facetData.id}
											values={values as RangeFacetValues}
										/>
									)
								}
								else {
									return null
								}
							})
					}
				</div>
			</aside>
			<SearchResult
				currentPage={currentPage}
				facetsData={facetsData}
				onClickResult={props.onClickResult}
				ResultBodyComponent={props.ResultBodyComponent}
				resultBodyProps={props.resultBodyProps}
				resultsPerPage={props.resultsPerPage}
				searchResult={searchResult}
				setCurrentPage={setCurrentPage}
				setSortOrder={setSortOrder}
				sortOrder={sortOrder}
			/>
		</Wrapper>
	)
}

FacetedSearch.defaultProps = {
	fields: [],
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
