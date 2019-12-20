import * as React from 'react'
import FacetValueView from '../list/value'
import FacetHeader from '../header'
import styled from '@emotion/styled'
import FacetWrapper from '../facet'

const List = styled('ul')`
	margin: 0;
	padding: 0;
`

function BooleanFacet(props: BooleanFacetProps) {
	return (
		<FacetWrapper>
			<FacetHeader facetData={props.facetData} />
			<List>
				{
					props.values.true > 0 &&
					<FacetValueView
						addFilter={() => props.addFilter('true')}
						active={props.facetData.filters.has('true')}
						key={'true'}
						keyFormatter={() => props.facetData.labels.true}
						removeFilter={() => props.removeFilter('true')}
						value={{ key: 'true', count: props.values.true }}
					/>
				}
				{
					props.values.false > 0 &&
					<FacetValueView
						addFilter={() => props.addFilter('false')}
						active={props.facetData.filters.has('false')}
						key={'false'}
						keyFormatter={() => props.facetData.labels.false}
						removeFilter={() => props.removeFilter('false')}
						value={{ key: 'false', count: props.values.false }}
					/>
				}
			</List>
		</FacetWrapper>
	)
}

BooleanFacet.defaultProps = {
	values: { false: 0, true: 0 },
}

export default React.memo(BooleanFacet)
