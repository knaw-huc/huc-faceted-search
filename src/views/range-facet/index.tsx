import * as React from 'react'
import HireRangeSlider from 'hire-range-slider'
import { FacetsProps } from '../facets'
import Facet from '../facet'
import FacetHeader from '../facet-header'
import styled from 'react-emotion'
import Histogram from './histogram'
import { RangeFacet } from '../../models/facet'

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
	granularity: 'year' | 'month' | 'day'
	title: string
	type?: 'number' | 'timestamp'
}
interface State {
	lowerLimit: number
	rangeMin: number,
	rangeMax: number,
	upperLimit: number
}
export default class RangeFacetView extends React.PureComponent<Props & FacetsProps, State> {
	state: State = {
		lowerLimit: 0,
		rangeMin: null,
		rangeMax: null,
		upperLimit: 1,
	}

	static defaultProps: Partial<Props> = {
		granularity: 'year',
		type: 'number',
	}

	componentDidMount() {
		this.props.state.facetsManager.rangeManager.addFacet(this.props.field, this.props.index)
	}

	// Reset the range facet when the filter is removed
	componentDidUpdate(prevProps: Props & FacetsProps) {
		 const { facets } = prevProps.state
		if (!facets.hasOwnProperty(prevProps.field)) return
		const prevFacet = facets[prevProps.field] as RangeFacet
		const facet = this.props.state.facets[this.props.field] as RangeFacet

		if (prevFacet.filter != null && facet.filter == null) {
			this.setState({
				lowerLimit: 0,
				rangeMin: null,
				rangeMax: null,
				upperLimit: 1,
			})
		}
	}

	render() {
		let min: number
		let max: number
		let histogramValues = []

		const { field, state } = this.props
		if (state.facets !== null && state.facets.hasOwnProperty(field)) {
			const facetData = state.facets[field] as RangeFacet
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
							this.props.state.facetsManager.rangeManager.addFilter(this.props.field, rangeMin, rangeMax)
						}
					}}
					style={{
						marginTop: '-4px',
						position: 'absolute',
					}}
					upperLimit={this.state.upperLimit}
				/>
				<Dates>
					<span>{this.formatNumber(min)}</span>
					<ActiveDates>
						{
							this.state.rangeMin != null && this.state.rangeMax != null &&
							<>
								<span style={{textAlign: 'right'}}>{this.formatNumber(this.state.rangeMin)}</span>
								<span style={{textAlign: 'center'}}>-</span>
								<span>{this.formatNumber(this.state.rangeMax)}</span>
							</>
						}
					</ActiveDates>
					<span style={{textAlign: 'right'}}>{this.formatNumber(max)}</span>
				</Dates>
			</Facet>
		)
	}

	formatNumber(num: number) {
		if (this.props.type === 'number') return num
		else if (this.props.type === 'timestamp') {
			let date: string
			const d = new Date(num)
			const year = d.getUTCFullYear()

			if (this.props.granularity === 'year') {
				date = isNaN(year) ? '' : year.toString()
			}
			else if (this.props.granularity === 'month') {
				date = `${year}-${d.getUTCMonth() + 1}`
			}
			else if (this.props.granularity === 'day') {
				date = `${year}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`
			}

			return date
		}
	}
}