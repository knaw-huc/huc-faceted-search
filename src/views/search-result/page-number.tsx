import * as React from 'react'
import styled from '@emotion/styled'
import { BACKGROUND_GRAY } from '../../constants'

export const Button = styled.div`
	cursor: pointer;
	user-select: none;

	&:hover {
		color: #444;
	}
`

interface PnProps { active: boolean }
const PageNumberWrapper = styled(Button)`
	background-color: ${(props: PnProps) => props.active ? BACKGROUND_GRAY : 'white'};
	border-radius: .25em;
	color: ${(props: PnProps) => props.active ? '#888' : 'inherit'};
	font-weight: ${(props: PnProps) => props.active ? 'bold' : 'normal'};
	padding: .35em;
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
			key={props.pageNumber}
			onClick={props.setCurrentPage}
		>
			{props.pageNumber}
		</PageNumberWrapper>
	)
}

export default React.memo(PageNumber)
