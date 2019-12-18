import * as React from 'react'
import styled from '@emotion/styled';
import { Input } from '../full-text-search';

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

type Props = ListFacetProps
// interface State {
// 	value: string
// }
// export default class Options extends React.PureComponent<Props, State> {
// 	state: State = {
// 		value: ''
// 	}

// 	render() {

function Options(props: Props) {
	const [value, setValue] = React.useState('')
	props
	return (
		<Wrapper>
			<H4>Order</H4>
			<RadioGroup>
				<Div>
					<input
						defaultChecked
						id="highest-first-radio"
						name="sort"
						onChange={() => props.sortListFacet(SortBy.Count, SortDirection.Desc)}
						type="radio"
					/>
					<label htmlFor="highest-first-radio">Highest first</label>
					<input
						id="lowest-first-radio"
						type="radio"
						name="sort"
						onChange={() => props.sortListFacet(SortBy.Count, SortDirection.Asc)}
					/>
					<label htmlFor="lowest-first-radio">Lowest first</label>
				</Div>
				<Div>
					<input
						id="az-radio"
						type="radio"
						name="sort"
						onChange={() => props.sortListFacet(SortBy.Key, SortDirection.Asc)}
					/>
					<label htmlFor="az-radio">A - Z</label>
					<input
						id="za-radio"
						name="sort"
						onChange={() => props.sortListFacet(SortBy.Key, SortDirection.Desc)}
						type="radio"
					/>
					<label htmlFor="za-radio">Z - A</label>
				</Div>
			</RadioGroup>
			<H4>Filter</H4>
			<Input
				onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
					// TODO use debounce
					const { value } = ev.target
					setValue(value)
					// this.setState({ value })

					props.addFacetQuery(value)
					// this.props.state.facetsManager.addListFilterQuery(this.props.field, value)
				}}
				style={{
					border: '1px solid #AAA',
					height: '2em',
					width: '100%',
				}}
				type="text"
				value={value}
			/>
		</Wrapper>
	)
}

export default React.memo(Options)

// 	private sortBy = (sortBy: SortBy, direction: SortDirection) => {
// 		return (ev: React.ChangeEvent<HTMLInputElement>) => {
// 			if (ev.target.value === 'on') {
// 				sortBy
// 				direction
// 				// this.props.state.facetsManager.sortListBy(
// 				// 	this.props.field,
// 				// 	sortBy,
// 				// 	direction
// 				// )
// 			}

// 		}
// 	}
// }
