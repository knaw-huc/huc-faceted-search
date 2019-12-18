import styled from '@emotion/styled';

export const Section = styled.section``

export const Header = styled.header`
	color: #888;
	display: grid;
	font-size: .85em;
	grid-template-rows: 32px auto;
`

export const ResultList = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
`

export const Result = styled.li`
	cursor: pointer;
`

export const Prev = styled.div`
	cursor: pointer;
	line-height: 1.8em;
	user-select: none;
	width: 1.8em;
`

export const Next = styled(Prev)`
	text-align: right;
`
