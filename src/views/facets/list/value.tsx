import * as React from 'react'
import styled from "@emotion/styled"
import { css } from '@emotion/core'

const Wrapper = styled('li')`
	cursor: pointer;
	display: grid;
	grid-template-columns: 24px 4fr 1fr;
	margin-bottom: .2em;
`

const common = (props: { active: boolean }) => css`
	color: ${props.active ? '#444' : '#888' };
	font-size: .9em;
	font-weight: ${props.active ? 'bold' : 'normal' };
`
const Key = styled('span')`
	${common}
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`

const Count = styled('span')`
	${common}
	text-align: right;
`

interface Props {
	active: boolean
	addFilter: () => void
	keyFormatter?: (key: string | number) => string
	removeFilter: () => void
	value: KeyCount
}

function FacetValueView(props: Props) {
	const { keyFormatter, value } = props
	const key = (keyFormatter != null) ? keyFormatter(value.key) : value.key

	return (
		<Wrapper
			onClick={props.active ? props.removeFilter : props.addFilter}
			title={props.value.key}
		>
			<input
				checked={props.active}
				onChange={props.active ? props.removeFilter : props.addFilter}
				type="checkbox"
			/>
			<Key active={props.active} dangerouslySetInnerHTML={{ __html: key }}></Key>
			<Count active={props.active}>{props.value.count}</Count>
		</Wrapper>

	)
}

export default React.memo(FacetValueView)
