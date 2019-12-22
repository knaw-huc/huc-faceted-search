import * as React from 'react'
import styled from '@emotion/styled'
import { getEndDate } from './utils'

interface WrapperProps { barCount: number }
const Wrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(${(props: WrapperProps) => props.barCount}, 1fr);
	grid-column-gap: 4px;
`

interface BarProps { count: number }
const Bar = styled.div`
	align-items: end;
	border: 1px solid white;
	box-sizing: border-box;
	height: 100%;
	cursor: ${(props: BarProps) => props.count > 0 ? 'pointer' : 'default'}};
	display: grid;

	&:hover {
		border: 1px solid #b6b6b6;
		& > div {
			background: #b6b6b6;
		}
	}
`

interface BarFillProps { height: number }
const BarFill = styled.div`
	background: #e6e6e6;
	height: ${(props: BarFillProps) => {
		let height = props.height
		if (height > 0 && height < .03) height = .03 /* Set minimum height to 3px */
		return `${height * 100}px`
	}};
`

// TODO remove lower/upperlimit
type Props = Pick<RangeFacetProps, 'facetData' | 'facetsDataDispatch' | 'values'> & {
	lowerLimit: number
	upperLimit: number
}
function Histogram(props: Props) {
	const counts = props.values.map(v => v.count)
	const maxCount = Math.max(...counts)

	const handleBarClick = React.useCallback((ev: any) => {
		const { count, value } = ev.currentTarget.dataset
		if (count === '0') return
		const from = parseInt(value, 10)
		const to = getEndDate(from, props.facetData.interval)
		props.facetsDataDispatch({ type: 'set_range', facetId: props.facetData.id, from, to })
	}, [props.values])

	return (
		<Wrapper barCount={props.values.length}>
			{
				props.values.map(value =>
					<Bar
						count={value.count}
						data-count={value.count}
						data-value={value.key}
						key={Math.random()}
						onClick={handleBarClick}
					>
						<BarFill
							height={value.count/maxCount}
						/>
					</Bar>
				)
			}
		</Wrapper>
	)
}

export default React.memo(Histogram)
