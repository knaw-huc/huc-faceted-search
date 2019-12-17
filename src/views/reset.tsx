import * as React from 'react'
import Button from './button'

export default (props: { onClick: () => void }) => (
	<Button
		onClick={props.onClick}
		style={{
			fontSize: '1.2em',
			marginTop: '2em',
		}}
	>
		Reset
	</Button>
)
