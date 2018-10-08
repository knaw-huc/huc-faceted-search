import * as React from 'react'
import styled from 'react-emotion'
// import { FacetMenuButton } from '../button'

const Header = styled('header')`
	display: grid;
	grid-template-columns: 2fr 1fr;
`

const H3 = styled('h3')`
	margin: 0 0 .5em 0;
`

interface Props {
	// collapse?: () => void
	title: string	
}
interface State {
	focus: boolean
}
export default class FacetHeader extends React.PureComponent<Props, State> {
	state: State = {
		focus: false
	}

	render() {
		return (
			<Header
				onMouseEnter={() => this.setState({ focus: true })}
				onMouseLeave={() => this.setState({ focus: false })}
			>
				<H3>{this.props.title}</H3>
				{ this.state.focus && this.props.children }
			</Header>
		)
	}
}