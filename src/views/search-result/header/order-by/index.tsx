import * as React from 'react'
import styled from '@emotion/styled'
import { Button } from '../../page-number'
import OrderOption from './option'

const Wrapper = styled.div`
	justify-self: end;	
	position: relative;
`

const OrderOptions = styled.ul`
	background: white;
	border: 1px solid #888;
	line-height: 1.6em;
	padding: .5em 1em;
	position: absolute;
	right: 0;
	width: 240px;
	z-index: 999;
`

interface Props {
	facetsData: FacetsData
	setSortOrder: SetSortOrder
	sortOrder: SortOrder
}
function OrderBy(props: Props) {
	const [showMenu, setShowMenu] = React.useState(false)

	return (
		<Wrapper>
			<Button
				onClick={() => setShowMenu(!showMenu)}
			>
				order by ▾
			</Button>
			{
				showMenu &&
				<OrderOptions>
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
				</OrderOptions>
			}
		</Wrapper>
	)
}

export default React.memo(OrderBy)
