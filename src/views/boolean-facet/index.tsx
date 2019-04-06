import * as React from 'react'
import Facet from '../facet'
import FacetValuesView from './values'
import FacetHeader from '../facet-header'
import { FacetsProps } from '../facets'
import { FacetType } from '../../models/facet'

export interface BooleanFacetProps {
	field: string
	labels?: [string, string]
	title: string
}
export default class BooleanFacet extends React.PureComponent<FacetsProps & BooleanFacetProps> {
	static defaultProps: Partial<BooleanFacetProps> = {
		labels: ["No", "Yes"]
	}

	componentDidMount() {
		this.props.state.facetsManager.addFacet(FacetType.Boolean, this.props.field, this.props.index)
	}

	render() {
		return (
			<Facet>
				<FacetHeader {...this.props}/>
				<FacetValuesView
					facet={this.props.state.facetsManager.getBooleanFacet(this.props.field)}
					field={this.props.field}
					labels={this.props.labels}
					state={this.props.state}
				/>
			</Facet>
		)
	}
}
