import * as React from 'react'
import styled from '@emotion/styled'

const Li = styled.li`
	display: grid;
	grid-template-columns: 120px auto;
	margin-bottom: .4em;

	& > div {
		padding: 2px 0;
	}
`

const Ul = styled.ul`
	display: grid;
	grid-template-columns: 140px 140px;
	grid-column-gap: .2em;
`

const FilterButton = styled.li`
	align-items: center;
	background: #EEE;
	border-bottom: 1px solid #BBB;
	border-radius: 6px;
	box-sizing: border-box;
	cursor: pointer;
	display: grid;
	grid-template-columns: 120px 20px;
	height: 24px;
	width: 140px;

	& > span:first-of-type {
		justify-self: right;
		max-width: calc(100% - 6px);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	& > span:last-of-type {
		justify-self: center;
	}
`

interface Props {
	dispatch: React.Dispatch<FacetsDataReducerAction>
	filter: ActiveFilter
}
function ActiveFilter(props: Props) {
	return (
		<Li>
			<div>{props.filter.title}</div>
			<Ul>
				{
					props.filter.values.map(value =>
						<FilterButton
							key={value}
							onClick={() => {
								props.dispatch({ type: 'remove_filter', facetId: props.filter.id, value })
							}}
							title={value}
						>
							<span>{value}</span>
							<span>✖</span>
						</FilterButton>		
					)
				}
			</Ul>
		</Li>
	)
}

export default React.memo(ActiveFilter)
