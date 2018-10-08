import * as React from 'react'
import styled from 'react-emotion'

const Wrapper = styled('div')`
	margin-top: 2em;
`
								
interface Props {
	style: React.CSSProperties
}
interface FacetState {
	collapsed: boolean
	focus: boolean
}
export default class Facet extends React.PureComponent<Props, FacetState> {
	state: FacetState = {
		collapsed: false,
		focus: false
	}

	static defaultProps = {
		style: {}
	}

	toggleState(field: keyof FacetState) {
		const nextState = { [field]: !this.state[field] } as Pick<FacetState, keyof FacetState>
		this.setState(nextState)
	}

	render() {
		return (
			<Wrapper style={this.props.style}>
				{this.props.children}
			</Wrapper>
		)
	}

}
