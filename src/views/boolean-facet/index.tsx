import * as React from 'react'
import Facet from '../facet'
import FacetValueView from '../list-facet/value'
// import BooleanFacetValuesView from './values'
import FacetHeader from '../facet-header'
import styled from '@emotion/styled'
// import { FacetsProps } from '../facets'

const List = styled('ul')`
	margin: 0;
	padding: 0;
`

export default class BooleanFacet extends React.PureComponent<BooleanFacetProps> {
	static defaultProps: Partial<BooleanFacetProps> = {
		labels: { false: "No", true: "Yes" }
	}

	componentDidMount() {
		// this.props.state.facetsManager.setBooleanFacet(this.props.field, this.props.index, {})
	}

	render() {
		const { true: trueCount, false: falseCount } = this.props.values

		return (
			<Facet>
				<FacetHeader {...this.props}/>
				<div>
					<List>
						{
							trueCount > 0 &&
							<FacetValueView
								addFilter={() => this.props.addFilter('true')}
								active={this.props.filters.has('true')}
								key={'true'}
								keyFormatter={() => this.props.labels.true}
								removeFilter={() => this.props.removeFilter('true')}
								value={{ key: 'true', count: trueCount }}
							/>
						}
						{
							falseCount > 0 &&
							<FacetValueView
								addFilter={() => this.props.addFilter('false')}
								active={this.props.filters.has('false')}
								key={'false'}
								keyFormatter={() => this.props.labels.false}
								removeFilter={() => this.props.removeFilter('false')}
								value={{ key: 'false', count: falseCount }}
							/>
						}
					</List>
				</div>
			</Facet>
		)
	}
}
