import * as React from 'react'
import styled from '@emotion/styled'
import { Button } from '../page-number'

interface OOProps { active: boolean }
const Wrapper = styled.li`
	border-bottom: 1px solid #eee;
	color: ${(props: OOProps) => props.active ? '#666' : 'inherit' };
	display: grid;
	grid-template-columns: 8fr 2fr;
	grid-gap: 1em;
	text-transform: capitalize;
	white-space: nowrap;

	&:last-of-type {
		border: 0;
	}

	& > .title {
		cursor: pointer;
		font-size: ${(props: OOProps) => props.active ? '1.1em' : '1em' };
		font-weight: ${(props: OOProps) => props.active ? 'bold' : 'normal' };
	}

	& > .toggle-direction {
		justify-self: end;
	}
`

function updateSortOrder(sortOrder: SortOrder, facetId: string, direction: SortDirection = SortDirection.Desc) {
	if (sortOrder.has(facetId) && sortOrder.get(facetId) === direction) sortOrder.delete(facetId)
	else sortOrder.set(facetId, direction)

	return new Map(sortOrder)
}

interface Props {
	facetData: FacetData
	sortOrder: SortOrder
	setSortOrder: SetSortOrder
}
function OrderOption(props: Props) {
	const setDirection = React.useCallback(ev => {
		ev.stopPropagation()

		const nextDirection = props.sortOrder.get(props.facetData.id) === SortDirection.Desc ?
			SortDirection.Asc :
			SortDirection.Desc

		const nextSortOrder = updateSortOrder(props.sortOrder, props.facetData.id, nextDirection)
		props.setSortOrder(nextSortOrder)
	}, [props.sortOrder, props.facetData])

	const setFacetId = React.useCallback(() => {
		const direction = props.sortOrder.get(props.facetData.id)
		const nextSortOrder = updateSortOrder(props.sortOrder, props.facetData.id, direction)
		props.setSortOrder(nextSortOrder)
	}, [props.sortOrder, props.facetData])

	const direction = props.sortOrder.get(props.facetData.id)

	return (
		<Wrapper
			active={direction != null}
			key={props.facetData.id}
			onClick={setFacetId}
		>
			<div className="title">
				{props.facetData.title || props.facetData.id}
			</div>
			{
				direction != null &&
				<Button
					className="toggle-direction"
					onClick={setDirection}
					title={direction === SortDirection.Desc ? 'Descending' : 'Ascending'}
				>
					{direction === SortDirection.Desc ? '▼' : '▲'}
				</Button>
			}
		</Wrapper>		
	)
}

export default React.memo(OrderOption)
