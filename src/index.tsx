/// <reference path="./types/index.d.ts" />

import * as React from 'react'
import styled from '@emotion/styled'
import ListFacet from './views/facets/list'
import BooleanFacet from './views/facets/boolean'
import DateFacet from './views/facets/date'
import RangeFacet from './views/facets/range'
// import Reset from './views/reset'
import ElasticSearchRequest from './io/request-creator'
import { fetchSearchResults, isBooleanFacet, isListFacet, isRangeFacet, isDateFacet } from './constants'
import elasticSearchResponseParser from './io/response-parser'
import Header from './views/header'
import SearchResult from './views/search-result'
import FullTextSearch from './views/full-text-search'
import useFacetsDataReducer from './reducers/facets-data'

const Wrapper = styled.div`
	margin-bottom: 10vh;

	${(props: { disableDefaultStyle: boolean}) => {
		if (!props.disableDefaultStyle) {
			return `
				display: grid;
				font-family: sans-serif;
				grid-template-columns: minmax(32px, auto) 352px minmax(320px, 672px) minmax(32px, auto);
				grid-template-rows: 104px auto;

				& > #huc-full-text-search {
					grid-column: 2;
				}

				& > #huc-fs-header {
					grid-column: 3;
				}
				
				& > #huc-fs-facets {
					grid-column: 2;
					grid-row: 2;
					margin-bottom: 10vh;
					padding-right: 32px;
				}

				& > #huc-fs-search-results {
					grid-column: 3;
					grid-row: 2;
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
	const [facetsData, facetsDataDispatch] = useFacetsDataReducer(props.fields)
	const searchResult = useSearchResult(props.url, {
		currentPage,
		excludeResultFields: props.excludeResultFields,
		facetsData,
		resultFields: props.resultFields,
		resultsPerPage: props.resultsPerPage,
		query,
		sortOrder,
	})

	const clearActiveFilters = React.useCallback(() => {
		setQuery('')
		setSortOrder(new Map())
		facetsDataDispatch({ type: 'clear', fields: props.fields })
	}, [props.fields])

	return (
		<Wrapper
			className={props.className}
			disableDefaultStyle={props.disableDefaultStyle}
			id="huc-fs"
		>
			<FullTextSearch
				autoSuggest={props.autoSuggest}
				setQuery={setQuery}
			/>
			<Header
				autoSuggest={props.autoSuggest}
				clearActiveFilters={clearActiveFilters}
				currentPage={currentPage}
				dispatch={facetsDataDispatch}
				facetsData={facetsData}
				searchResult={searchResult}
				resultsPerPage={props.resultsPerPage}
				setCurrentPage={setCurrentPage}
				setSortOrder={setSortOrder}
				sortOrder={sortOrder}
			/>
			<div id="huc-fs-facets">
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
							else if (isDateFacet(facetData)) {
								return (
									<DateFacet
										facetData={facetData}
										facetsDataDispatch={facetsDataDispatch}
										key={facetData.id}
										values={values as RangeFacetValues}
									/>
								)
							}
							else if (isRangeFacet(facetData)) {
								return (
									<RangeFacet
										facetData={facetData}
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
			<SearchResult
				onClickResult={props.onClickResult}
				ResultBodyComponent={props.ResultBodyComponent}
				resultBodyProps={props.resultBodyProps}
				searchResult={searchResult}
			/>
		</Wrapper>
	)
}

FacetedSearch.defaultProps = {
	excludeResultFields: [],
	fields: [],
	resultFields: [],
	resultsPerPage: 10,
}

export default React.memo(FacetedSearch)
