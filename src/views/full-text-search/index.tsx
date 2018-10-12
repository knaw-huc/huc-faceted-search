import * as React from 'react'
import styled from 'react-emotion';
import Context, { ContextState } from '../../context'
import AutoSuggest from './auto-suggest'

export const Input = styled('input')`
	box-sizing: border-box;
	font-size: 1.2em;
	outline: none;
	padding: .5em;
	width: 100%;
`

interface ConsumerProps {
	state: ContextState
}
interface Props {
	autoSuggest: (query: string) => Promise<string[]>
}
interface State {
	value: string
}
class FullTextSearch extends React.PureComponent<Props & ConsumerProps, State> {
	state = {
		value: ''
	}

	render() {
		return (
			<div style={{ position: 'relative' }}>
				<Input
					type="text"
					onChange={(ev) => {
						this.setQuery(ev.target.value)

					}}
					placeholder="Search it"
					value={this.state.value}
				/>
				{
					this.props.autoSuggest != null &&
					<AutoSuggest
						autoSuggest={this.props.autoSuggest}
						onClick={(query) => this.setQuery(query)}
						value={this.state.value}
					/>	
				}
			</div>
		)
	}

	private setQuery(query: string) {
		this.setState({ value: query })
		this.props.state.facetsManager.addQuery(query)
	}
}


export default (props: Props) => (
	<Context.Consumer>
		{
			state => <FullTextSearch { ...props } state={state} />
		}
	</Context.Consumer>
);