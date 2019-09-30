import * as React from 'react'
import Facet from '../facet'
import BooleanFacetValuesView from './values'
import FacetHeader from '../facet-header'
import { FacetsProps } from '../facets'

export default class BooleanFacet extends React.PureComponent<FacetsProps & BooleanFacetProps> {
	static defaultProps: Partial<BooleanFacetProps> = {
		labels: { false: "No", true: "Yes" }
	}

	componentDidMount() {
		this.props.state.facetsManager.setBooleanFacet(this.props.field, this.props.index, {})
	}

	render() {
		return (
			<Facet>
				<FacetHeader {...this.props}/>
				<BooleanFacetValuesView
					facet={this.props.state.facetsManager.getBooleanFacet(this.props.field)}
					field={this.props.field}
					labels={this.props.labels}
					state={this.props.state}
				/>
			</Facet>
		)
	}
}
