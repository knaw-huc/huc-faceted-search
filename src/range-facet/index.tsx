import * as React from 'react'
import HireRangeSlider from 'hire-range-slider'
import { FacetsProps } from '../facets';
import { IRangeFacet } from '../io-manager/range-manager'
import Facet from '../facet';
import FacetHeader from '../facet-header';
import styled from 'react-emotion';
import Histogram from './histogram'

const Dates = styled('div')`
	color: #888;
	display: grid;
	font-size: .9em;
	grid-template-columns: 1fr auto 1fr;
	margin-top: 1em;
`

const ActiveDates = styled('div')`
	color: #444;
	display: grid;
	font-weight: bold;
	grid-template-columns: 1fr 16px 1fr;
`

interface Props {
	field: string
	id: string
	title: string
}
interface State {
	lowerLimit: number
	rangeMin: number,
	rangeMax: number,
	upperLimit: number
}
export default class RangeFacet extends React.PureComponent<Props & FacetsProps, State> {
	state: State = {
		lowerLimit: 0,
		rangeMin: null,
		rangeMax: null,
		upperLimit: 1,
	}

	componentDidMount() {
		this.props.state.ioManager.addRangeFacet(this.props.id, this.props.field)
	}

	render() {
		let min: number
		let max: number
		let histogramValues = []

		const { state, id } = this.props
		if (state.facets !== null && state.facets.hasOwnProperty(id)) {
			const facetData = state.facets[id] as IRangeFacet
			min = facetData.values[0]
			max = facetData.values[1]
			histogramValues = facetData.histogramValues
		}

		return (
			<Facet style={{position: 'relative'}}>
				<FacetHeader {...this.props} />
				<Histogram
					lowerLimit={this.state.lowerLimit}
					upperLimit={this.state.upperLimit}
					values={histogramValues}
				/>
				<HireRangeSlider
					lowerLimit={this.state.lowerLimit}
					onChange={(data: any) => {
						const rangeMin = Math.floor(min + (data.lowerLimit * (max - min)))
						const rangeMax = Math.ceil(min + (data.upperLimit * (max - min)))
						this.setState({
							rangeMin,
							rangeMax,
							lowerLimit: data.lowerLimit,
							upperLimit: data.upperLimit,
						})

						if (data.refresh) {
							this.props.state.ioManager.addRangeFilter(this.props.field, rangeMin, rangeMax)
							this.setState({
								rangeMin,
								rangeMax,
								lowerLimit: data.lowerLimit,
								upperLimit: data.upperLimit,
							})
						}
					}}
					style={{
						marginTop: '-4px',
						position: 'absolute',
					}}
					upperLimit={this.state.upperLimit}
				/>
				<Dates>
					<span>{min}</span>
					<ActiveDates>
						{
							this.state.rangeMin != null && this.state.rangeMax != null &&
							<>
								<span style={{textAlign: 'right'}}>{this.state.rangeMin}</span>
								<span style={{textAlign: 'center'}}>-</span>
								<span>{this.state.rangeMax}</span>
							</>
						}
					</ActiveDates>
					<span style={{textAlign: 'right'}}>{max}</span>
				</Dates>
			</Facet>
		)
	}
}