import * as React from 'react'
import styled from 'react-emotion';
import Context, { ContextState } from '../context'

export const Input = styled('input')`
	box-sizing: border-box;
	font-size: 1.2em;
	outline: none;
	padding: .5em;
	width: 100%;
`

interface Props {
	state: ContextState
}
interface State {
	value: string
}
class FullTextSearch extends React.PureComponent<Props, State> {
	state = {
		value: ''
	}

	render() {
		return (
			<div>
				<Input
					type="text"
					onChange={(ev) => {
						const { value } = ev.target
						this.setState({ value })
						this.props.state.ioManager.addQuery(value)
					}}
					placeholder="Search"
					value={this.state.value}
				/>
			</div>
		)
	}
}


export default () => (
	<Context.Consumer>
		{
			state => <FullTextSearch state={state} />
		}
	</Context.Consumer>
);