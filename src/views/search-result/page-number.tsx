import * as React from 'react'
import styled from '@emotion/styled'
import { Prev } from './components'

interface PnProps { active: boolean }
const PageNumberWrapper = styled(Prev)`
	background-color: ${(props: PnProps) => props.active ? '#888' : 'white'};
	border-radius: 1em;
	color: ${(props: PnProps) => props.active ? 'white' : '#444'};
	font-weight: ${(props: PnProps) => props.active ? 'bold' : 'normal'};
	text-align: center;
`

interface Props {
	currentPage: number
	pageNumber: number
	setCurrentPage: () => void
}
function PageNumber(props: Props) {
	return (
		<PageNumberWrapper
			active={props.pageNumber === props.currentPage}
			className={props.pageNumber === props.currentPage ? 'active' : null}
			key={props.pageNumber}
			onClick={props.setCurrentPage}
		>
			{props.pageNumber}
		</PageNumberWrapper>
	)
}

export default React.memo(PageNumber)
