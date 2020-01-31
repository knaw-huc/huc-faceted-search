import * as React from 'react'
import OrderOption from './option'
import DropDown from '../../ui/drop-down'
import styled from '@emotion/styled'

const SortByDropDown = styled(DropDown)`
	& > .huc-fs-dropdown-button {
		height: 46px;
	}

	& > .huc-fs-dropdown-body {
		left: 32px;
		width: 240px;
	}
`

interface Props {
	facetsData: FacetsData
	setSortOrder: SetSortOrder
	sortOrder: SortOrder
}
function SortBy(props: Props) {
	return (
		<SortByDropDown
			label={`sort by (${props.sortOrder.size})`}
			z={998}
		>
			{
				Array.from(props.facetsData.values())
					.sort((field1, field2) => {
						const a = props.sortOrder.has(field1.id)
						const b = props.sortOrder.has(field2.id)
						if (a === b) return field1.order - field2.order
						return a ? -1 : 1
					})
					.map(field =>
						<OrderOption
							facetData={field}
							key={field.id}
							sortOrder={props.sortOrder}
							setSortOrder={props.setSortOrder}
						/>
					)
			}
		</SortByDropDown>
	)
}

export default React.memo(SortBy)
