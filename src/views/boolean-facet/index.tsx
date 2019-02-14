import * as React from 'react'
import Facet from '../facet'
import FacetValuesView from './values'
import FacetHeader from '../facet-header'
import { FacetsProps } from '../facets'

export interface BooleanFacetProps {
	field: string
	labels?: [string, string]
	title: string
}
export default class ListFacet extends React.PureComponent<FacetsProps & BooleanFacetProps> {
	static defaultProps: Partial<BooleanFacetProps> = {
		labels: ["No", "Yes"]
	}

	componentDidMount() {
		this.props.state.facetsManager.booleanManager.addFacet(this.props.field, this.props.index)
	}

	render() {
		return (
			<Facet>
				<FacetHeader {...this.props}/>
				<FacetValuesView {...this.props} {...this.state} />
			</Facet>
		)
	}
}
