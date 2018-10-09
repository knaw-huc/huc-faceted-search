import * as React from 'react'
import { MoreLessButton } from '../button'
import { Props } from './values'
import { ListFacet } from '../../models/facet';

export default function(props: Props) {
	if (!props.state.facets.hasOwnProperty(props.field)) return null
	const facet = props.state.facets[props.field] as ListFacet

	return (
		<>
			{
				facet.total > 0 &&
				facet.total > facet.viewSize &&
				<MoreLessButton
					onClick={() => props.state.facetsManager.listManager.viewMore(props.field)}
				>
					{`View more (${facet.total - facet.viewSize})`}
				</MoreLessButton>
			}
			{
				facet.size < facet.viewSize &&
				<MoreLessButton
					onClick={() => props.state.facetsManager.listManager.viewLess(props.field)}
				>
					View less
				</MoreLessButton>
			}
		</>
	)
}
