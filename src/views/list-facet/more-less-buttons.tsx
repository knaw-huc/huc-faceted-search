import * as React from 'react'
import { MoreLessButton } from '../button'

export default function(props: Pick<ListFacetProps, 'facetData' | 'values' | 'viewMore' | 'viewLess'>) {
	return (
		<>
			{
				props.values.total > 0 &&
				props.values.total > props.facetData.viewSize &&
				<MoreLessButton
					onClick={props.viewMore}
				>
					{`View more (${props.values.total - props.facetData.viewSize})`}
				</MoreLessButton>
			}
			{
				props.facetData.size < props.facetData.viewSize &&
				<MoreLessButton
					onClick={props.viewLess}
				>
					View less
				</MoreLessButton>
			}
		</>
	)
}
