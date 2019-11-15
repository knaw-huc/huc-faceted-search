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
	labels: { true: string, false: string }
	state: ContextState
}
export default class BooleanFacetValuesView extends React.PureComponent<Props> {
	render() {
		if (this.props.facet == null) return null

		const { true: trueCount, false: falseCount } = this.props.facet.values

		return (
			<div>
				<List>
					{
						trueCount > 0 &&
						<FacetValueView
							addFilter={() => this.props.state.facetsManager.addFilter(this.props.field, 'true')}
							active={this.props.facet.filters.has('true')}
							key={'true'}
							keyFormatter={() => this.props.labels.true}
							removeFilter={() => this.props.state.facetsManager.removeFilter(this.props.field, 'true')}
							value={{ key: 'true', count: trueCount }}
						/>
					}
					{
						falseCount > 0 &&
						<FacetValueView
							addFilter={() => this.props.state.facetsManager.addFilter(this.props.field, 'false')}
							active={this.props.facet.filters.has('false')}
							key={'false'}
							keyFormatter={() => this.props.labels.false}
							removeFilter={() => this.props.state.facetsManager.removeFilter(this.props.field, 'false')}
							value={{ key: 'false', count: falseCount }}
						/>
					}
				</List>
			</div>
		)
	}
}
