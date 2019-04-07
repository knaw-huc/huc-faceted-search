import * as React from 'react'
import FacetValueView from '../list-facet/value'
import styled from '@emotion/styled'
import { BooleanFacet } from '../../models/facet'
import { ContextState } from '../../context'

const List = styled('ul')`
	margin: 0;
	padding: 0;
`

export interface Props {
	facet: BooleanFacet
	field: string
	labels: [string, string]
	state: ContextState
}
export default class FacetValuesView extends React.PureComponent<Props> {
	render() {
		if (this.props.facet == null) return null

		return (
			<div>
				<List>
					{
						this.props.facet.values.map(value =>
							<FacetValueView
								addFilter={() => this.props.state.facetsManager.addFilter(this.props.field, value.key)}
								active={this.props.facet.filters.has(value.key)}
								key={value.key}
								keyFormatter={(key: string | number) => this.props.labels[key as number]}
								removeFilter={() => this.props.state.facetsManager.removeFilter(this.props.field, value.key)}
								value={value}
							/>
						)
					}
				</List>
			</div>
		)
	}
}
