import * as React from 'react'
import { MoreLessButton } from '../button'
import { Props } from './values'

export default function(props: Props) {
	const facet = props.state.facetsManager.getListFacet(props.field)

	console.log(facet.values)
	return (
		<>
			{
				facet.values.total > 0 &&
				facet.values.total > facet.viewSize &&
				<MoreLessButton
					onClick={() => props.state.facetsManager.viewMore(props.field)}
				>
					{`View more (${facet.values.total - facet.viewSize})`}
				</MoreLessButton>
			}
			{
				facet.settings.size < facet.viewSize &&
				<MoreLessButton
					onClick={() => props.state.facetsManager.viewLess(props.field)}
				>
					View less
				</MoreLessButton>
			}
		</>
	)
}
