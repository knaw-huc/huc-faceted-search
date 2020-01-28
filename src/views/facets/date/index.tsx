import * as React from 'react'
import FacetHeader from '../header'
import FacetWrapper from '../facet'
import RangeFacetBody from './body'


function DateFacetView(props: DateFacetProps) {
	return (
		<FacetWrapper>
			<FacetHeader facetData={props.facetData} />
			{
				props.values.values.length > 0 &&
				<RangeFacetBody { ...props } />
			}
		</FacetWrapper>
	)
}

DateFacetView.defaultProps = {
	values: []
}

export default React.memo(DateFacetView)
