import * as React from 'react'
import FacetHeader from '../header'
import FacetWrapper from '../facet'
import RangeFacetBody from './body'


function RangeFacetView(props: RangeFacetProps) {
	// const [[rangeMin, rangeMax], setRange] = React.useState([null, null])

	// if (!props.values.length) return null

	// const [fMin, fMax] = formatRange(props.facetData, rangeMin, rangeMax)

	// const minValue = props.values[0].key
	// const maxValue = props.values[props.values.length - 1].key

	// const lowerLimit = timestampToRatio(minValue, props.values)
	// const upperLimit = timestampToRatio(maxValue, props.values)
	// console.log(lowerLimit, upperLimit)

	return (
		<FacetWrapper>
			<FacetHeader facetData={props.facetData} />
			{
				props.values.length > 0 &&
				<RangeFacetBody { ...props } />
			}
		</FacetWrapper>
	)
}

RangeFacetView.defaultProps = {
	values: []
}

export default React.memo(RangeFacetView)
