import * as React from 'react'
import FacetValueView from './value'
import styled from 'react-emotion'
import { ListFacetProps, ListFacetState } from './index'
import { FacetsProps } from '../facets';
import { ListFacetValue, ListFacet } from '../../models/facet';
import MoreLessButtons from './more-less-buttons'

const DURATION = 500
const FRAME_DURATION = 16
function easeOutQuint(t: number): number { return 1+(--t)*t*t*t*t }

const Wrapper = styled('div')`
	overflow: hidden;
`

const List = styled('ul')`
	margin: 0;
	padding: 0;
`

export type Props = FacetsProps & ListFacetProps & ListFacetState
interface State {
	values: ListFacetValue[]
}
export default class FacetValuesView extends React.PureComponent<Props, State> {
	private wrapperRef: React.RefObject<HTMLDivElement>
	private listHeight: number
	state: State = {
		values: []
	}

	constructor(props: Props) {
		super(props)
		this.wrapperRef = React.createRef()
	}

	static getDerivedStateFromProps(props: Props) {
		const { facets } = props.state
		const values = (facets == null || !facets.hasOwnProperty(props.field)) ?
			[] :
			facets[props.field].values
		return { values }
	}

	componentDidUpdate(prevProps: Props, prevState: State) {
		if (prevState.values.length !== this.state.values.length) this.setHeight()

		if (!prevProps.collapsed && this.props.collapsed) this.animate()
		else if (prevProps.collapsed && !this.props.collapsed) this.animate(true)
	}

	render() {
		return (
			<Wrapper
				innerRef={this.wrapperRef}
			>
				<List>
					{
						this.state.values.map(value =>
							<FacetValueView
								addFilter={() => this.props.state.facetsManager.listManager.addFilter(this.props.field, value.key)}
								active={(this.props.state.facets[this.props.field] as ListFacet).filters.has(value.key)}
								key={value.key}
								removeFilter={() => this.props.state.facetsManager.listManager.removeFilter(this.props.field, value.key)}
								value={value}
							/>
						)
					}
				</List>
				<MoreLessButtons {...this.props} />
			</Wrapper>
		)
	}

	private animate(reverse: boolean = false) {
		let elapsed = 0
		const interval = setInterval(() => {
			elapsed += FRAME_DURATION
			let ratio = easeOutQuint(elapsed/DURATION)
			if (!reverse) ratio = 1 - ratio
			let currentHeight = `${this.listHeight * ratio}px`
			if (elapsed > DURATION) {
				currentHeight = reverse ? 'auto' : '0'
				clearInterval(interval)
			}
			this.wrapperRef.current.style.height = currentHeight
		}, FRAME_DURATION)
	}

	private setHeight() {
		if (this.listHeight == null || this.listHeight > 0) {
			this.listHeight = this.wrapperRef.current.getBoundingClientRect().height
		}
	}
}
