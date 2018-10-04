import * as React from 'react'
import FacetValue, { IFacetValue } from './value'
import styled from 'react-emotion'
import { MoreLessButton } from '../button'
import { ListFacetProps, ListFacetState } from './index'
import { FacetsProps } from '../facets';

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

type Props = FacetsProps & ListFacetProps & ListFacetState
interface State {
	values: IFacetValue[]
}
export default class FacetValues extends React.PureComponent<Props, State> {
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
		const values = (facets == null || !facets.hasOwnProperty(props.id)) ?
			[] :
			facets[props.id].values
		return { values }
	}

	componentDidUpdate(prevProps: Props, prevState: State) {
		if (prevState.values.length !== this.state.values.length) this.setHeight()

		if (!prevProps.collapsed && this.props.collapsed) this.animate()
		else if (prevProps.collapsed && !this.props.collapsed) this.animate(true)
	}

	render() {
		// console.log(this.props.state.ioManager.request)
		// console.log(this.props.id, this.props.field)
		return (
			<Wrapper
				innerRef={this.wrapperRef}
			>
				<List>
					{
						this.state.values.map(value =>
							<FacetValue
								addFilter={() => this.props.state.ioManager.addListFilter(this.props.field, value.key)}
								key={value.key}
								removeFilter={() => this.props.state.ioManager.removeListFilter(this.props.field, value.key)}
								value={value}
							/>
						)
					}
				</List>
				<MoreLessButton
					onClick={() => this.props.state.ioManager.viewMoreFacetValues(this.props.id, this.props.field, this.props.size)}
				>
					View more
				</MoreLessButton>
				{
					this.state.values.length && this.props.size !== this.state.values.length &&
					<MoreLessButton
						onClick={() => this.props.state.ioManager.viewLessFacetValues(this.props.id, this.props.field, this.props.size)}
					>
						View less
					</MoreLessButton>
				}
			</Wrapper>
		)
	}

	// @ts-ignore
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
