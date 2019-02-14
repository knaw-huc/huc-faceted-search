import * as React from 'react'
import FacetValueView from '../list-facet/value'
import styled from 'react-emotion'
import { BooleanFacetProps } from './index'
import { FacetsProps } from '../facets';
import { ListFacetValue, BooleanFacet } from '../../models/facet'

const List = styled('ul')`
	margin: 0;
	padding: 0;
`

export type Props = FacetsProps & BooleanFacetProps
interface State {
	values: ListFacetValue[]
}
export default class FacetValuesView extends React.PureComponent<Props, State> {
	state: State = {
		values: []
	}

	static getDerivedStateFromProps(props: Props) {
		const { facets } = props.state
		const values = (facets == null || !facets.hasOwnProperty(props.field)) ?
			[] :
			facets[props.field].values
		return { values }
	}

	render() {
		console.log(this.state.values)
		return (
			<div>
				<List>
					{
						this.state.values.map(value =>
							<FacetValueView
								addFilter={() => this.props.state.facetsManager.booleanManager.addFilter(this.props.field, value.key)}
								active={(this.props.state.facets[this.props.field] as BooleanFacet).filters.has(value.key)}
								key={value.key}
								keyFormatter={(key: string | number) => {
									return this.props.labels[key as number]
								}}
								removeFilter={() => this.props.state.facetsManager.booleanManager.removeFilter(this.props.field, value.key)}
								value={value}
							/>
						)
					}
				</List>
			</div>
		)
	}
}
