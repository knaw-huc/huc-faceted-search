import * as React from 'react'
import { MoreLessButton } from '../button'
import { Props } from './values'

export default function(props: Props) {
	// const facet = props.state.facetsManager.getListFacet(props.field)

	return (
		<>
			{
				props.values.total > 0 &&
				props.values.total > props.size &&
				<MoreLessButton
					// onClick={() => props.state.facetsManager.viewMore(props.field)}
				>
					{`View more (${values.total - props.size})`}
				</MoreLessButton>
			}
			{/* {
				props.settings.size < props.size &&
				<MoreLessButton
					// onClick={() => props.state.facetsManager.viewLess(props.field)}
				>
					View less
				</MoreLessButton>
			} */}
		</>
	)
}
