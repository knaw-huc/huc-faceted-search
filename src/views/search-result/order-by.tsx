import * as React from 'react'
import styled from '@emotion/styled'
import { Button } from './page-number'

const Wrapper = styled.div`
	justify-self: end;	
	position: relative;
`

const OrderOptions = styled.ul`
	background: yellow;
	padding: .5em;
	position: absolute;
	right: 0;
	width: 200px;
	z-index: 999;

	& > li {
		cursor: pointer;
		text-transform: capitalize;
	}
`

// TODO use facetsData instead of fields. Then render the active facets first and then the rest minus the active facets
interface Props {
	fields: AppProps['fields']
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
				Order by ▾
			</Button>
			{
				showMenu &&
				<OrderOptions>
					{
						props.fields
							.sort((field1, field2) => {
								const a = props.sortOrder.has(field1.id)
								const b = props.sortOrder.has(field2.id)
								if (a === b) return field1.order - field2.order
								return a ? -1 : 1
							})
							.map(field =>
								<li
									key={field.id}
									onClick={() => props.setSortOrder(field.id, SortDirection.Desc)}
								>
									<input
										checked={props.sortOrder.has(field.id)}
										readOnly
										type="checkbox"
									/>
									{props.sortOrder.has(field.id)}
									{field.title || field.id}
								</li>		
							)
					}
				</OrderOptions>
			}
		</Wrapper>
	)
}

export default React.memo(OrderBy)
