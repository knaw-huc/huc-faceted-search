import * as React from 'react'
import { Section, ResultList, Result } from './components'
import Pagination from './pagination'
import Header from './header'

type Props = Pick<AppProps, 'onClickResult' | 'ResultBodyComponent' | 'resultBodyProps' | 'resultsPerPage'> & {
	currentPage: number
	dispatch: React.Dispatch<FacetsDataReducerAction>
	facetsData: FacetsData
	searchResult: FSResponse
	setCurrentPage: (pageNumber: number) => void
	setSortOrder: SetSortOrder
	sortOrder: SortOrder
}

function HucSearchResults(props: Props) {
	return (
		<Section id="huc-fs-search-results">
			<Header
				currentPage={props.currentPage}
				dispatch={props.dispatch}
				facetsData={props.facetsData}
				searchResult={props.searchResult}
				resultsPerPage={props.resultsPerPage}
				setCurrentPage={props.setCurrentPage}
				setSortOrder={props.setSortOrder}
				sortOrder={props.sortOrder}
			/>
			<ResultList>
				{
					props.searchResult.results.map((hit, i) =>
						<Result
							key={i}
							onClick={(ev) => {
								if (props.onClickResult != null) props.onClickResult(hit, ev)
							}}
						>
							<props.ResultBodyComponent
								{...props.resultBodyProps}
								result={hit}
							/>
						</Result>
					)
				}
			</ResultList>
			<Pagination
				currentPage={props.currentPage}
				resultsPerPage={props.resultsPerPage}
				searchResults={props.searchResult}
				setCurrentPage={props.setCurrentPage}
			/>
		</Section>
	)
}

export default React.memo(HucSearchResults)
