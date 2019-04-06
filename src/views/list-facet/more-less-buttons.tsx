import * as React from 'react'
import { MoreLessButton } from '../button'
import { Props } from './values'

export default function(props: Props) {
	const facet = props.state.facetsManager.getListFacet(props.field)

	return (
		<>
			{
				facet.total > 0 &&
				facet.total > facet.viewSize &&
				<MoreLessButton
					onClick={() => props.state.facetsManager.viewMore(props.field)}
				>
					{`View more (${facet.total - facet.viewSize})`}
				</MoreLessButton>
			}
			{
				facet.size < facet.viewSize &&
				<MoreLessButton
					onClick={() => props.state.facetsManager.viewLess(props.field)}
				>
					View less
				</MoreLessButton>
			}
		</>
	)
}
