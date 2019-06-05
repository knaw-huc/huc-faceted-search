/// <reference path="./types.d.ts" />

import * as React from 'react'
import { Section, Header, ResultList, Result } from './components'
import Pagination from './pagination'
import { ContextState } from '../context'

interface Props {
	goToPage: (pageNumber: number) => void
	onClickResult: (result: any, ev: React.MouseEvent<HTMLLIElement>) => void
	pageNumber: number
	resultBodyComponent: React.SFC<ResultBodyProps>
	resultBodyProps: Record<string, any>
	resultsPerPage: number
	state: ContextState
}
export default class HucSearchResults extends React.PureComponent<Props> {
	render() {
		return (
			<Section>

				<Header>
					<div>
						Found {this.props.state.searchResult.total} result{this.props.state.searchResult.total === 1 ? '' : 's'}
					</div>
					<Pagination
						goToPage={this.props.goToPage}
						pageNumber={this.props.pageNumber}
						resultsPerPage={this.props.resultsPerPage}
						searchResults={this.props.state.searchResult}
					/>
					{/* <OrderBy /> */}
				</Header>
				<ResultList>
					{
						this.props.state.searchResult.hits.map((hit, i) =>
							<Result
								key={i}
								onClick={(ev) => {
									if (this.props.onClickResult != null) this.props.onClickResult(hit, ev)
								}}
							>
								<this.props.resultBodyComponent
									{...this.props.resultBodyProps}
									result={hit}
								/>
							</Result>
						)
					}
				</ResultList>
				<Pagination
					goToPage={this.props.goToPage}
					pageNumber={this.props.pageNumber}
					resultsPerPage={this.props.resultsPerPage}
					searchResults={this.props.state.searchResult}
				/>
			</Section>
		)
	}
}

