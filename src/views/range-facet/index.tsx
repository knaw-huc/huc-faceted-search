import * as React from 'react'
import HireRangeSlider from 'hire-range-slider'
import { FacetsProps } from '../facets'
import Facet from '../facet'
import FacetHeader from '../facet-header'
import styled from '@emotion/styled'
import Histogram from './histogram'
import { RangeFacet } from '../../models/facet'

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

export function ratioToTimestamp(ratio: number, facet: RangeFacet) {
	const minValue = facet.values[0].key
	const maxValue = facet.values[facet.values.length - 1].key
	return Math.floor(minValue + (ratio * (maxValue - minValue)))
}
export function timestampToRatio(timestamp: number, facet: RangeFacet) {
	const minValue = facet.values[0].key
	const maxValue = facet.values[facet.values.length - 1].key
	return (timestamp - minValue) / (maxValue - minValue)
}

export default class RangeFacetView extends React.PureComponent<RangeProps & FacetsProps, RangeState> {
	state: RangeState = {
		rangeMin: null,
		rangeMax: null,
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

		if (prevFacet.filter != null && facet.filter == null) {
			this.setState({
				rangeMin: null,
				rangeMax: null,
			})
		} else if (Array.isArray(facet.filter) && facet.filter.length === 2) {
			this.setState({
				rangeMin: facet.filter[0],
				rangeMax: facet.filter[1],
			})
		}
	}

	render() {
		const facet = this.props.state.facetsManager.getRangeFacet(this.props.field)
		if (facet == null) return null

		const [fMin, fMax] = this.formatRange()
		const minValue = facet.values[0].key
		const maxValue = facet.values[facet.values.length - 1].key

		const lowerLimit = timestampToRatio(this.state.rangeMin || minValue, facet)
		const upperLimit = timestampToRatio(this.state.rangeMax || maxValue, facet)

		return (
			<Facet style={{position: 'relative'}}>
				<FacetHeader {...this.props} />
				<Histogram
					lowerLimit={lowerLimit}
					upperLimit={upperLimit}
					values={facet.values}
				/>
				<HireRangeSlider
					lowerLimit={lowerLimit}
					onChange={(data: any) => {
						const rangeMin = ratioToTimestamp(data.lowerLimit, facet)
						const rangeMax = ratioToTimestamp(data.upperLimit, facet)
						this.setState({ rangeMin, rangeMax })

						if (data.refresh) {
							this.props.state.facetsManager.addFilter(this.props.field, rangeMin, rangeMax)
						}
					}}
					style={{
						marginTop: '-6px',
						position: 'absolute',
					}}
					upperLimit={upperLimit}
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
