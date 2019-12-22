import * as React from 'react'
import FacetValueView from '../list/value'
import FacetHeader from '../header'
import styled from '@emotion/styled'
import FacetWrapper from '../facet'

const List = styled('ul')`
	margin: 0;
	padding: 0;
`

let prevProps: any

function BooleanFacet(props: BooleanFacetProps) {
	console.log(prevProps === props)
	for (const prop in props) {
		if (prevProps) console.log(prop, prevProps[prop] === (props as any)[prop])
	}

	prevProps = props
	return (
		<FacetWrapper>
			<FacetHeader facetData={props.facetData} />
			<List>
				{
					props.values.true > 0 &&
					<FacetValueView
						active={props.facetData.filters.has('true')}
						facetId={props.facetData.id}
						facetsDataDispatch={props.facetsDataDispatch}
						key={'true'}
						keyFormatter={() => props.facetData.labels.true}
						// TODO don't create an object here
						value={{ key: 'true', count: props.values.true }}
					/>
				}
				{
					props.values.false > 0 &&
					<FacetValueView
						active={props.facetData.filters.has('false')}
						facetId={props.facetData.id}
						facetsDataDispatch={props.facetsDataDispatch}
						key={'false'}
						keyFormatter={() => props.facetData.labels.false}
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
