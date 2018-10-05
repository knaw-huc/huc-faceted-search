import * as React from 'react'
import Context from './context'
import Button from './button'

export default () => (
	<Context.Consumer>
		{
			state =>
				<Button
					onClick={() => state.ioManager.reset()}
					style={{
						fontSize: '1.2em',
						marginTop: '2em',
					}}
				>
					Reset
				</Button>
		}
	</Context.Consumer>
)