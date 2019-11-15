import * as React from 'react'
import Suggestion from './suggestion'
import styled from '@emotion/styled'
import debounce from 'lodash.debounce'

const Suggestions = styled('ul')`
	border-bottom: 0;
	border-left: 1px solid #CCC;
	border-right: 1px solid #CCC;
	box-sizing: border-box;
	list-style: none;
	margin: 0;
	padding: 0;
	position: absolute;
	top: 45px;
	width: calc(100% - 100px);
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
	private cache: {[key: string]: string[]} = {}
	state: State = {
		suggestions: []
	}

	async componentDidUpdate(prevProps: Props, prevState: State) {
		// The update came from a suggestion click
		if (prevState.suggestions.length && !this.state.suggestions.length) return

		if (prevProps.value !== this.props.value) {
			this.requestAutoSuggest()
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

	private autoSuggest = async () => {
		let suggestions: string[]

		if (this.cache.hasOwnProperty(this.props.value)) {
			suggestions = this.cache[this.props.value]
		} else {
			suggestions = await this.props.autoSuggest(this.props.value)
			this.cache[this.props.value] = suggestions
		}

		this.setState({ suggestions })
	}
	private requestAutoSuggest = debounce(this.autoSuggest, 300)
}
