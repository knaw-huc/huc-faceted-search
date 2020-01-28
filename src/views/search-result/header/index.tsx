import * as React from 'react'
import OrderBy from './order-by'
import ActiveFilters from './selected-values'
import styled from '@emotion/styled'
import Pagination from '../pagination'


export const Header = styled.header`
	color: #888;
	display: grid;
	font-size: .85em;
	grid-template-rows: auto 48px auto;
	grid-template-columns: 2fr 1fr;

	& > .right {
		justify-self: right;
	}
`

type Props = Pick<AppProps, 'resultsPerPage'> & {
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
		<Header>
			<ActiveFilters
				dispatch={props.dispatch}
				facetsData={props.facetsData}
			/>
			<div className="right">
				Found {props.searchResult.total} result{props.searchResult.total === 1 ? '' : 's'}
				<OrderBy
					facetsData={props.facetsData}
					setSortOrder={props.setSortOrder}
					sortOrder={props.sortOrder}
				/>
			</div>
			<Pagination
				currentPage={props.currentPage}
				resultsPerPage={props.resultsPerPage}
				searchResults={props.searchResult}
				setCurrentPage={props.setCurrentPage}
			/>
		</Header>
	)
}

export default React.memo(HucSearchResults)
