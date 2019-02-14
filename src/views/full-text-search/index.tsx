import * as React from 'react'
import styled from '@emotion/styled'
import Context, { ContextState } from '../../context'
import AutoSuggest from './auto-suggest'
import debounce from 'lodash.debounce'

export const Input = styled('input')`
	background-color: white;
	border: 1px solid #AAA;
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
	suggest: boolean
	value: string
}
class FullTextSearch extends React.PureComponent<Props & ConsumerProps, State> {
	state = {
		suggest: false,
		value: ''
	}

	render() {
		return (
			<div style={{ position: 'relative' }}>
				<Input
					type="text"
					onChange={(ev) => {
						this.setState({
							suggest: true,
							value: ev.target.value
						})
						this.requestAddQuery(ev.target.value)
					}}
					onClick={() => this.setState({ suggest: false })}
					placeholder="Search"
					value={this.state.value}
				/>
				{
					this.props.autoSuggest != null &&
					this.state.suggest &&
					<AutoSuggest
						autoSuggest={this.props.autoSuggest}
						onClick={this.addQuery}
						value={this.state.value}
					/>	
				}
			</div>
		)
	}

	// This is public, so the input value can be set from outside the lib
	addQuery = (query: string) => {
		this.setState({ suggest: false, value: query })
		this._addQuery(query)
	}


	private _addQuery = (query: string) => {
		this.props.state.facetsManager.addQuery(query)
	}
	private requestAddQuery = debounce(this._addQuery, 300)
}


export default React.forwardRef((props: Props, ref: React.Ref<FullTextSearch>) => (
	<Context.Consumer>
		{
			state => <FullTextSearch
				{ ...props }
				ref={ref}
				state={state}
			/>
		}
	</Context.Consumer>
))
