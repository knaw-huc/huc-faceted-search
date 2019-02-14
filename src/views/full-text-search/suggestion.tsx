import * as React from "react"
import styled from '@emotion/styled';

interface LiProps {
	hover: boolean
}
const Li = styled('li')`
	background: ${(props: LiProps) => props.hover ? '#EEE' : '#FFF'};
	border-bottom: 1px solid #CCC;
	cursor: pointer;
	padding: .5em;
`

interface Props {
	onClick: (query: string) => void
	value: string
}
interface State {
	hover: boolean
}
export default class Suggestion extends React.Component<Props, State> {
	public state = {
		hover: false,
	}

	public render() {
		return (
			<Li
				// onClick={() => this.props.activateSuggestion(this.props.children as string)}
				onClick={() => this.props.onClick(this.props.value)}
				onMouseEnter={() => this.setState({ hover: true })}
				onMouseLeave={() => this.setState({ hover: false })}
				hover={this.state.hover}
			>
				{this.props.value}
			</Li>
		)
	}
}
