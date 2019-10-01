import * as React from 'react'
import HireRangeSlider from 'hire-range-slider'
import { FacetsProps } from '../facets'
import Facet from '../facet'
import FacetHeader from '../facet-header'
import styled from '@emotion/styled'
import Histogram from './histogram'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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

export default class RangeFacetView extends React.PureComponent<RangeProps & FacetsProps, RangeState> {
	state: RangeState = {
		lowerLimit: 0,
		rangeMin: null,
		rangeMax: null,
		upperLimit: 1,
	}

	static defaultProps: Partial<RangeProps> = {
		interval: 'year',
		type: 'number',
	}

	componentDidMount() {
		this.props.state.facetsManager.setRangeFacet(this.props.field, this.props.index, {
			interval: this.props.interval
		})
	}

	// Reset the range facet when the filter is removed
	componentDidUpdate(prevProps: RangeProps & FacetsProps) {
		const prevFacet = prevProps.state.facetsManager.getRangeFacet(prevProps.field)
		const facet = this.props.state.facetsManager.getRangeFacet(this.props.field)

		if (prevFacet.values.filter != null && facet.values.filter == null) {
			this.setState({
				lowerLimit: 0,
				rangeMin: null,
				rangeMax: null,
				upperLimit: 1,
			})
		}
	}

	render() {
		const facet = this.props.state.facetsManager.getRangeFacet(this.props.field)
		if (facet == null) return null

		const [fMin, fMax] = this.formatRange()
		const minValue = facet.values[0].key
		const maxValue = facet.values[facet.values.length - 1].key

		return (
			<Facet style={{position: 'relative'}}>
				<FacetHeader {...this.props} />
				<Histogram
					lowerLimit={this.state.lowerLimit}
					upperLimit={this.state.upperLimit}
					values={facet.values}
				/>
				<HireRangeSlider
					lowerLimit={this.state.lowerLimit}
					onChange={(data: any) => {
						const rangeMin = Math.floor(minValue + (data.lowerLimit * (maxValue - minValue)))
						const rangeMax = Math.ceil(minValue + (data.upperLimit * (maxValue - minValue)))
						this.setState({
							rangeMin,
							rangeMax,
							lowerLimit: data.lowerLimit,
							upperLimit: data.upperLimit,
						})

						if (data.refresh) {
							this.props.state.facetsManager.addFilter(this.props.field, rangeMin, rangeMax)
						}
					}}
					style={{
						marginTop: '-6px',
						position: 'absolute',
					}}
					upperLimit={this.state.upperLimit}
				/>
				<Dates>
					<span>{this.formatDate(minValue)}</span>
					<ActiveDates>
						{
							this.state.rangeMin != null && this.state.rangeMax != null &&
							<>
								<span style={{textAlign: 'right'}}>{fMin}</span>
								<span style={{textAlign: 'center'}}>-</span>
								<span>{fMax}</span>
							</>
						}
					</ActiveDates>
					<span style={{textAlign: 'right'}}>{this.formatDate(maxValue)}</span>
				</Dates>
			</Facet>
		)
	}

	private formatRange() {
		if (this.props.type === 'number') return [this.state.rangeMin, this.state.rangeMax]

		const dateMin = new Date(this.state.rangeMin)
		const yearMin = dateMin.getUTCFullYear()

		const dateMax = new Date(this.state.rangeMax)
		const yearMax = dateMax.getUTCFullYear()

		return [this.formatDate(this.state.rangeMin, yearMin === yearMax), this.formatDate(this.state.rangeMax)]
	}

	private formatDate(num: number, sameYear?: boolean) {
		if (this.props.type === 'number') return num

		let date: string = ''
		const d = new Date(num)
		const year = d.getUTCFullYear()

		if (this.props.interval === 'year' && !sameYear) {
			date = isNaN(year) ? '' : year.toString()
		}
		else if (this.props.interval === 'month') {
			date = `${months[d.getUTCMonth()]}`
			if (!sameYear) date += ` ${year}`
		}
		else if (this.props.interval === 'day') {
			date = `${d.getUTCDate()} ${months[d.getUTCMonth()]}`
			if (!sameYear) date += ` ${year}`
		}

		return date
	}
}
