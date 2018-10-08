import * as React from 'react'
import { FacetsProps } from '../facets';
import { ListFacetProps } from './index';
import styled from 'react-emotion';
import { Input } from '../full-text-search';
import { SortBy, SortDirection } from '../../models/facet';

const Wrapper = styled('div')`
	font-size: .9em;
	margin-bottom: 2em;
`

const RadioGroup = styled('div')`
	border: 1px solid #AAA;
	display: grid;
	grid-template-columns: 1fr 1fr;
	padding: 1em;
`

const Div = styled('div')`
	list-style: none;
	display: grid;
	grid-template-columns: 24px 1fr;
	grid-template-rows: 1fr 1fr;
`

const H4 = styled('h4')`
	color: gray;
	font-weight: normal;
	margin: 1em 0 .2em 0;
	padding: 0;
`

type Props = FacetsProps & ListFacetProps
interface State {
	value: string
}
export default class Options extends React.PureComponent<Props, State> {
	state: State = {
		value: ''
	}

	render() {
		return (
			<Wrapper>
				<H4>Order</H4>
				<RadioGroup>
					<Div>
						<input
							defaultChecked
							id="highest-first-radio"
							name="sort"
							onChange={this.sortBy(SortBy.Count, SortDirection.Desc)}
							type="radio"
						/>
						<label htmlFor="highest-first-radio">Highest first</label>
						<input
							id="lowest-first-radio"
							type="radio"
							name="sort"
							onChange={this.sortBy(SortBy.Count, SortDirection.Asc)}
						/>
						<label htmlFor="lowest-first-radio">Lowest first</label>
					</Div>
					<Div>
						<input
							id="az-radio"
							type="radio"
							name="sort"
							onChange={this.sortBy(SortBy.Key, SortDirection.Asc)}
						/>
						<label htmlFor="az-radio">A - Z</label>
						<input
							id="za-radio"
							name="sort"
							onChange={this.sortBy(SortBy.Key, SortDirection.Desc)}
							type="radio"
						/>
						<label htmlFor="za-radio">Z - A</label>
					</Div>
				</RadioGroup>
				<H4>Filter</H4>
				<Input
					onChange={ev => {
						const { value } = ev.target
						this.setState({ value })
						this.props.state.ioManager.listManager.addQuery(this.props.field, value)
					}}
					style={{
						height: '2em'
					}}
					type="text"
					value={this.state.value}
				/>
			</Wrapper>
		)
	}

	private sortBy = (sortBy: SortBy, direction: SortDirection) => {
		return (ev: React.ChangeEvent<HTMLInputElement>) => {
			if (ev.target.value === 'on') {
				this.props.state.ioManager.listManager.sortBy(
					this.props.field,
					sortBy,
					direction
				)
			}

		}
	}
}