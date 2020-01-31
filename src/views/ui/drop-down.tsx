import * as React from 'react'
import styled from '@emotion/styled'
import { Button } from '../header/page-number'

const Wrapper = styled.div`
	display: inline-block;
`

const DropDownButton = styled(Button)`
	background: rgba(0, 0, 0, 0);
	border: 1px solid rgba(0, 0, 0, 0);
	position: relative;
	transition: all 300ms;
	white-space: nowrap;
	z-index: ${props => props.z + 1};

	& > span {
		font-size: .65rem;
	}

	${(props: { showMenu: boolean, z: number }) => {
		if (props.showMenu) {
			return `
				background: white;
				border: 1px solid #888;
				border-bottom: 1px solid white;
				padding: 0 12px;
			`
		}
	}}
`

const Body = styled.div`
	background: white;
	border: 1px solid #888;
	line-height: 1.6em;
	margin-top: -1px;
	opacity: ${(props: { showMenu: boolean, z: number }) => props.showMenu ? 1 : 0};
	padding: .5em 1em;
	pointer-events: ${props => props.showMenu ? 'all' : 'none'};
	position: absolute;
	transition: opacity 300ms;
	z-index: ${props => props.z};
`

interface Props {
	children: React.ReactNode
	className?: string
	label: string
	z: number
}
function DropDown(props: Props) {
	const [showMenu, setShowMenu] = React.useState(false)
	const hideMenu = React.useCallback(() => setShowMenu(false), [])

	const handleClick = React.useCallback(ev => {
		ev.stopPropagation()
		
		setShowMenu(!showMenu)
	}, [showMenu])

	React.useEffect(() => {
		if (showMenu) window.addEventListener('click', hideMenu)
		else window.removeEventListener('click', hideMenu)

		return () => {
			window.removeEventListener('click', hideMenu)
		}
	}, [showMenu])

	return (
		<Wrapper className={props.className}>
			<DropDownButton
				className="huc-fs-dropdown-button"
				onClick={handleClick}
				showMenu={showMenu}
				z={props.z}
			>
				{props.label} <span>{showMenu ? '▲' : '▼'}</span>
			</DropDownButton>
			<Body
				className="huc-fs-dropdown-body"
				showMenu={showMenu}
				z={props.z}
			>
				{props.children}
			</Body>
		</Wrapper>
	)
}

export default React.memo(DropDown)
