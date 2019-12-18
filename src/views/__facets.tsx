import * as React from 'react'
import Context, { ContextState } from '../context'

// export interface FacetsProps {
// 	index?: number
// 	state?: ContextState
// }
class Facets extends React.PureComponent<FacetsProps> {
	componentDidMount() {
		if (Array.isArray(this.props.children)) {
			this.props.state.facetsManager.setFacetCount(this.props.children.length)
		}
	}

	render() {
		return this.props.children
	}
}

export default (props: any) => (
	<Context.Consumer>
		{
			state =>
				<Facets state={state}>
					{
						React.Children.map(props.children, (child: any, index: number) => {
							return React.cloneElement(child, { state, index })
						})
					}
				</Facets>
		}
	</Context.Consumer>
)