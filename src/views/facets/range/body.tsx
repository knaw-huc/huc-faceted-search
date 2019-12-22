import * as React from 'react'
// import Slider from './slider'
import styled from '@emotion/styled'
import Histogram from './histogram'
import { formatDate, formatRange, timestampToRatio, ratioToTimestamp, getEndDate } from './utils'

formatRange
ratioToTimestamp

const Dates = styled('div')`
	color: #888;
	display: grid;
	font-size: .9em;
	grid-template-columns: 1fr auto 1fr;
	margin-top: 1em;
`

const Date = styled.span``
const DateMax = styled(Date)`
	justify-self: end;
`

const ActiveDates = styled('div')`
	color: #444;
	display: grid;
	font-weight: bold;
	grid-template-columns: 1fr 16px 1fr;
`

function RangeFacetBody(props: RangeFacetProps) {
	const minValue = props.values[0].key
	const maxValue = getEndDate(props.values[props.values.length - 1].key, props.facetData.interval)

	const lowerLimit = timestampToRatio(minValue, props.values)
	const upperLimit = timestampToRatio(maxValue, props.values)

	return (
		<>
			<Histogram
				lowerLimit={lowerLimit}
				facetData={props.facetData}
				facetsDataDispatch={props.facetsDataDispatch}
				upperLimit={upperLimit}
				values={props.values}
			/>
			{/* <Slider
				lowerLimit={lowerLimit}
				onChange={(data: any) => {
					// const rangeMin = ratioToTimestamp(data.lowerLimit, props.values)
					// const rangeMax = ratioToTimestamp(data.upperLimit, props.values)
					// setRange([ rangeMin, ran)geMax ])
					console.log(data)
				}}
				style={{
					marginTop: '-6px',
					position: 'absolute',
				}}
				upperLimit={upperLimit}
			/> */}
			<Dates>
				<Date>{formatDate(props.facetData, minValue)}</Date>
				<ActiveDates>
					{/* {
						rangeMin != null && rangeMax != null &&
						<>
							<span style={{textAlign: 'right'}}>{fMin}</span>
							<span style={{textAlign: 'center'}}>-</span>
							<span>{fMax}</span>
						</>
					} */}
				</ActiveDates>
				<DateMax>{formatDate(props.facetData, maxValue)}</DateMax>
			</Dates>
		</>
	)
}

export default React.memo(RangeFacetBody)
