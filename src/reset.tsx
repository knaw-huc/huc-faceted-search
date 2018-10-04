import * as React from 'react'
import Context from './context'
import Button from './button'

export default () => (
	<Context.Consumer>
		{
			state =>
				<Button
					onClick={() => state.ioManager.reset()}
				>
					Clear
				</Button>
		}
	</Context.Consumer>
)