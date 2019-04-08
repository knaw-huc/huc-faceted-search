import * as React from 'react'
import FacetValueView from './value'
import styled from '@emotion/styled'
import { ListFacet } from '../../models/facet'
import MoreLessButton from './more-less-buttons'
import { ContextState } from '../../context'

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

export type Props = {
	collapsed: boolean
	facet: ListFacet
	field: string
	state: ContextState
}
export default class FacetValuesView extends React.PureComponent<Props> {
	private wrapperRef = React.createRef() as React.RefObject<HTMLDivElement>
	private listHeight: number

	componentDidUpdate(prevProps: Props) {
		if (
			prevProps.facet != null &&
			this.listHeight == null
		) this.setHeight()

		if (!prevProps.collapsed && this.props.collapsed) this.animate()
		else if (prevProps.collapsed && !this.props.collapsed) this.animate(true)
	}

	render() {
		if (this.props.facet == null) return null

		return (
			<Wrapper
				ref={this.wrapperRef}
			>
				<List>
					{
						this.props.facet.values.map(value =>
							<FacetValueView
								addFilter={() => this.props.state.facetsManager.addFilter(this.props.field, value.key)}
								active={this.props.state.facetsManager.getListFacet(this.props.field).filters.has(value.key)}
								key={value.key}
								removeFilter={() => this.props.state.facetsManager.removeFilter(this.props.field, value.key)}
								value={value}
							/>
						)
					}
				</List>
				{
					// Don't show MoreLessButton, when the results are filtered by a query,
					// because the MoreLess-count does not take the filter into account
					!this.props.facet.query.length && 
					<MoreLessButton {...this.props} />
				}
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
