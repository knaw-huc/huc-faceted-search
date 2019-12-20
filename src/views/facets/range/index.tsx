import * as React from 'react'
import HireRangeSlider from 'hire-range-slider'
import FacetHeader from '../header'
import styled from '@emotion/styled'
import Histogram from './histogram'
import { formatDate, formatRange, timestampToRatio, ratioToTimestamp } from './utils'
import FacetWrapper from '../facet'


const Dates = styled('div')`
	color: #888;
	display: grid;
	font-size: .9em;
	grid-template-columns: 1fr auto 1fr;
	margin-top: 1em;
`

const ActiveDates = styled('div')`
	color: #444;
	display: grid;
	font-weight: bold;
	grid-template-columns: 1fr 16px 1fr;
`

// export default class RangeFacetView extends React.PureComponent<RangeFacetProps, RangeState> {
// 	state: RangeState = {
// 		rangeMin: null,
// 		rangeMax: null,
// 	}

// 	static defaultProps: Partial<RangeFacetProps> = {
// 		values: [
// 			{ key: 0, count: 0 },
// 			{ key: 1, count: 0 },
// 		]
// 	}

	// componentDidMount() {
	// 	this.props.state.facetsManager.setRangeFacet(this.props.field, this.props.index, {
	// 		interval: this.props.interval
	// 	})
	// }

	// // Reset the range facet when the filter is removed
	// componentDidUpdate(_prevProps: RangeFacetProps) {
	// 	if (facet.filters == null && this.state.rangeMin != null) {
	// 		this.setState({
	// 			rangeMin: null,
	// 			rangeMax: null,
	// 		})
	// 	} else if (Array.isArray(facet.filters) && facet.filters.length === 2) {
	// 		this.setState({
	// 			rangeMin: facet.filters[0],
	// 			rangeMax: facet.filters[1],
	// 		})
	// 	}
	// }

	// render() {
		// const facet = this.props.state.facetsManager.getRangeFacet(this.props.field)
		// const facet: any = null
		// if (facet == null || facet.values == null || facet.values.length < 2) return null

function RangeFacetView(props: RangeFacetProps) {
	console.log(props.values)
	const [[rangeMin, rangeMax], setRange] = React.useState([null, null])

	const [fMin, fMax] = formatRange(props.facetData, rangeMin, rangeMax)
	const minValue = props.values[0].key
	const maxValue = props.values[props.values.length - 1].key

	const lowerLimit = timestampToRatio((rangeMin || minValue), props.values)
	const upperLimit = timestampToRatio((rangeMax || maxValue), props.values)

	return (
		<FacetWrapper>
			<FacetHeader facetData={props.facetData} />
			<Histogram
				lowerLimit={lowerLimit}
				upperLimit={upperLimit}
				values={props.values}
			/>
			<HireRangeSlider
				lowerLimit={lowerLimit}
				onChange={(data: any) => {
					const rangeMin = ratioToTimestamp(data.lowerLimit, props.values)
					const rangeMax = ratioToTimestamp(data.upperLimit, props.values)
					setRange([ rangeMin, rangeMax ])

					if (data.refresh) {
						// props.state.facetsManager.addFilter(props.field, rangeMin, rangeMax)
					}
				}}
				style={{
					marginTop: '-6px',
					position: 'absolute',
				}}
				upperLimit={upperLimit}
			/>
			<Dates>
				<span>{formatDate(props.facetData, minValue)}</span>
				<ActiveDates>
					{
						rangeMin != null && rangeMax != null &&
						<>
							<span style={{textAlign: 'right'}}>{fMin}</span>
							<span style={{textAlign: 'center'}}>-</span>
							<span>{fMax}</span>
						</>
					}
				</ActiveDates>
				<span style={{textAlign: 'right'}}>{formatDate(props.facetData, maxValue)}</span>
			</Dates>
		</FacetWrapper>
	)
}

RangeFacetView.defaultProps = {
	values: [
		{ key: 0, count: 0 },
		{ key: 1, count: 0 },
	]
}

export default React.memo(RangeFacetView)
