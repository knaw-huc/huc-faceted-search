import * as React from 'react'
import { Section, Header, ResultList, Result } from './components'
import Pagination from './pagination'
import OrderBy from './order-by'

type Props = Pick<AppProps, 'fields' | 'onClickResult' | 'ResultBodyComponent' | 'resultBodyProps' | 'resultsPerPage'> & {
	currentPage: number
	searchResult: FSResponse
	setCurrentPage: (pageNumber: number) => void
	setSortOrder: SetSortOrder
	sortOrder: SortOrder
}

function HucSearchResults(props: Props) {
	return (
		<Section id="huc-fs-search-results">
			<Header>
				<div>
					Found {props.searchResult.total} result{props.searchResult.total === 1 ? '' : 's'}
				</div>
				<OrderBy
					fields={props.fields}
					setSortOrder={props.setSortOrder}
					sortOrder={props.sortOrder}
				/>
				<Pagination
					currentPage={props.currentPage}
					resultsPerPage={props.resultsPerPage}
					searchResults={props.searchResult}
					setCurrentPage={props.setCurrentPage}
				/>
			</Header>
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
