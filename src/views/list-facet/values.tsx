import * as React from 'react'
import FacetValueView from './value'
import styled from '@emotion/styled'

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
	addFilter: (field: string, value: string) => void
	collapse: boolean
	field: string
	filters: Set<string>
	removeFilter: (field: string, value: string) => void
	values: ListFacetValues
}

function useAnimate(collapse: boolean, ref: React.MutableRefObject<HTMLDivElement>) {
	React.useEffect(() => {
		let elapsed = 0
		const listHeight = ref.current.getBoundingClientRect().height

		const interval = setInterval(() => {
			elapsed += FRAME_DURATION
			let ratio = easeOutQuint(elapsed/DURATION)
			if (collapse) ratio = 1 - ratio
			let currentHeight = `${listHeight * ratio}px`
			if (elapsed > DURATION) {
				currentHeight = !collapse ? 'auto' : '0'
				clearInterval(interval)
			}
			ref.current.style.height = currentHeight
		}, FRAME_DURATION)
	}, [collapse])
}

function FacetValuesView(props: Props) {
	const ref = React.useRef()
	useAnimate(props.collapse, ref)

	return (
		<Wrapper ref={ref}>
			<List>
				{
					props.values.values
						// .sort((value1, value2) => {
						// 	const active1 = this.props.state.facetsManager.getListFacet(this.props.field).filters.has(value1.key)
						// 	const active2 = this.props.state.facetsManager.getListFacet(this.props.field).filters.has(value2.key)
						// 	if (active1 && !active2) return -1
						// 	if (!active1 && active2) return 1
						// 	return 0
						// })
						.map(value =>
							<FacetValueView
								addFilter={() => props.addFilter(props.field, value.key)}
								active={props.filters.has(value.key)}
								key={value.key}
								removeFilter={() => props.removeFilter(props.field, value.key)}
								value={value}
							/>
						)
				}
			</List>
			{
				// Don't show MoreLessButton, when the results are filtered by a query,
				// because the MoreLess-count does not take the filter into account
				// !this.props.query?.length && 
				// <MoreLessButton {...this.props} />
			}
		</Wrapper>
	)
}

export default React.memo(FacetValuesView)

// private animate(reverse: boolean = false) {
// }

// private setHeight() {
// 	if (this.listHeight == null || this.listHeight > 0) {
// 		this.listHeight = this.wrapperRef.current.getBoundingClientRect().height
// 	}
// }
// }
