import * as React from 'react'
import styled from '@emotion/styled'

const Header = styled('header')`
	display: grid;
	grid-template-columns: 2fr 1fr;
`

const H3 = styled('h3')`
	color: #444;
	font-size: 1rem;
	margin: 0 0 .5em 0;
`

interface Props {
	children: React.ReactNode
	title: string	
}
function FacetHeader(props: Props) {
	const [focus, setFocus] = React.useState(false)
	return (
		<Header
			onMouseEnter={() => setFocus(true)}
			onMouseLeave={() => setFocus(false)}
		>
			<H3>{props.title}</H3>
			{ focus && props.children }
		</Header>
	)
}

export default React.memo(FacetHeader)
