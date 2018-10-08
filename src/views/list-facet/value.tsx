import * as React from 'react'
import styled, { css } from "react-emotion"
import { ListFacetValue } from '../../models/facet'

const Wrapper = styled('li')`
	cursor: pointer;
	display: grid;
	grid-template-columns: 24px 4fr 1fr;
	margin-bottom: .2em;
`

const common = (props: { active: boolean }) => css`
	color: ${props.active ? '#444' : '#888' };
	font-size: .9em;
	font-weight: ${props.active ? 'bold' : 'normal' };
`
const Key = styled('span')`
	${common}
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`

const Count = styled('span')`
	${common}
	text-align: right;
`

interface Props {
	active: boolean
	addFilter: () => void
	removeFilter: () => void
	value: ListFacetValue
}
interface State {
	active: boolean
}
export default class FacetValueView extends React.PureComponent<Props, State> {
	state: State = {
		active: this.props.active
	}

	static defaultProps: Partial<Props> = {
		active: false
	}

	static getDerivedStateFromProps(props: Props) {
		return { active: props.active }
	}

	render() {
		return (
			<Wrapper
				onClick={this.toggleActive}
				title={this.props.value.key}
			>
				<input
					checked={this.state.active}
					onChange={this.toggleActive}
					type="checkbox"
				/>
				<Key {...this.state}>{this.props.value.key}</Key>
				<Count {...this.state}>{this.props.value.doc_count}</Count>
			</Wrapper>

		)
	}

	private toggleActive = () => {
		const nextActive = !this.state.active
		if (nextActive) this.props.addFilter()
		else this.props.removeFilter()
		this.setState({ active: nextActive })
	}

}