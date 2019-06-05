import * as React from 'react'
import styled from '@emotion/styled';

function getRange(start: number, end: number) {
	return Array.from({length: end - start + 1}, (_value, key) => key + start)
}

const Wrapper = styled.div`
	display: grid;
	grid-template-columns: 32px auto 32px;
	margin: 0 .2em 1em .2em;

	& > div:last-of-type {
		justify-self: end;
	}
`

const PageNumbers = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(32px, 1fr));
	justify-items: center;
`

const Prev = styled.div`
	cursor: pointer;
	line-height: 1.8em;
	user-select: none;
	width: 1.8em;
`

const Next = styled(Prev)`
	text-align: right;
`

interface PnProps { active: boolean }
const PageNumber = styled(Prev)`
	background-color: ${(props: PnProps) => props.active ? '#888' : 'white'};
	border-radius: 1em;
	color: ${(props: PnProps) => props.active ? 'white' : '#444'};
	font-weight: ${(props: PnProps) => props.active ? 'bold' : 'normal'};
	text-align: center;
`


interface Props {
	goToPage: (pageNumber: number) => void
	pageNumber: number
	resultsPerPage: number
	searchResults: SearchResults
}
export default class Pagination extends React.PureComponent<Props> {
	componentDidUpdate(prevProps: Props) {
		if (prevProps.searchResults.total !== this.props.searchResults.total) {
			this.setState({ pageNumber: 1 })
		}
	}

	render() {
		const pageCount = Math.ceil(this.props.searchResults.total / this.props.resultsPerPage)
		if (isNaN(pageCount) || pageCount === 1) return null

		const { first, current, last } = this.getPages(pageCount)

		return (
			<Wrapper>
				{this.props.pageNumber !== 1 ?
					<Prev onClick={() => this.handlePageNumberClick(this.props.pageNumber - 1)}>◂</Prev> :
					<div />
				}
				<PageNumbers>
					{first.length > 0 && first.map(this.toPageNumber)}
					{current.length > 0 && <div>…</div>}
					{current.map(this.toPageNumber)}
					{last.length > 0 && <div>…</div>}
					{last.length > 0 && last.map(this.toPageNumber)}
				</PageNumbers>
				{this.props.pageNumber !== pageCount ?
					<Next onClick={() => this.handlePageNumberClick(this.props.pageNumber + 1)}>▸</Next> :
					<div />
				}
			</Wrapper>
		)
	}

	private getPages(pageCount: number) {
		let first: number[] = []
		let current: number[] = []
		let last: number[] = []

		if (pageCount < 10) {
			current = getRange(1, pageCount)
		} else {
			first = [1]
			last = [pageCount]

			if (this.props.pageNumber < 6) {
				first = getRange(1, 7)
			}
			else if (this.props.pageNumber > pageCount - 6) {
				last = getRange(pageCount - 6, pageCount)
			}
			else {
				current = getRange(this.props.pageNumber - 2, this.props.pageNumber + 2)
			}
		}

		return { first, current, last }
	}
	private toPageNumber = (pageNumber: number) =>
		<PageNumber
			active={pageNumber === this.props.pageNumber}
			key={pageNumber}
			onClick={() => this.handlePageNumberClick(pageNumber)}
		>
			{pageNumber}
		</PageNumber>

	private handlePageNumberClick = (pageNumber: number) => {
		this.setState({ pageNumber })
		this.props.goToPage(pageNumber)
	}
}
