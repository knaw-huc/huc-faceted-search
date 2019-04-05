/// <reference path="./types.d.ts" />

import * as React from 'react'
import { Section, Header, ResultList, Result } from './components'

interface Props {
	onClickResult?: (result: any, ev: React.MouseEvent<HTMLLIElement>) => void
	resultBodyComponent: React.SFC<ResultBodyProps>
	searchResults: SearchResults
}
export default class HucSearchResults extends React.PureComponent<Props> {
	static defaultProps: Pick<Props, 'searchResults'> = {
		searchResults: {
			hits: [],
			id: null,
			query: {},
			total: 0,
		}
	}

	render() {
		return (
			<Section>

				<Header>
					<div>
						Found {this.props.searchResults.total} result{this.props.searchResults.total === 1 ? '' : 's'}
					</div>

					{/* <OrderBy /> */}
				</Header>
				<ResultList>
					{
						this.props.searchResults.hits.map((hit, i) =>
							<Result
								key={i}
								onClick={(ev) => {
									if (this.props.onClickResult != null) this.props.onClickResult(hit, ev)
								}}
							>
								<this.props.resultBodyComponent result={hit} />
							</Result>
						)
					}
				</ResultList>
			</Section>
		)
	}
}

