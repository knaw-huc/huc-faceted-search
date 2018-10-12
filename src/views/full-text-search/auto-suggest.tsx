import * as React from 'react'
import Suggestion from './suggestion'
import styled from 'react-emotion';

const Suggestions = styled('ul')`
	box-sizing: border-box;
	list-style: none;
	margin: 0;
	padding: 0;
	position: absolute;
	width: calc(100% - 100px);
	border-left: 1px solid #CCC;
	border-right: 1px solid #CCC;
	border-bottom: 0;
	z-index: 1;
`


interface Props {
	autoSuggest: (query: string) => Promise<string[]>
	onClick: (query: string) => void
	value: string
}
interface State { 
	suggestions: string[]
}
export default class AutoSuggest extends React.PureComponent<Props, State> {
	state: State = {
		suggestions: []
	}

	async componentDidUpdate(prevProps: Props, prevState: State) {
		// The update came from a suggestion click
		if (prevState.suggestions.length && !this.state.suggestions.length) return

		if (prevProps.value !== this.props.value) {
			const suggestions = await this.props.autoSuggest(this.props.value)
			this.setState({ suggestions })
		}
	}

	render() {
		return (
			<Suggestions>
				{
					this.state.suggestions.map((suggestion, index) =>
						<Suggestion
							key={index}
							onClick={(query) => {
								this.setState({ suggestions: [] })
								this.props.onClick(query)
							}}
							value={suggestion}
						/>
					)
				}
			</Suggestions>
		)
	}
}