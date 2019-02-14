import * as React from 'react'

enum ChartType {
	Bar,
	Horizon
}
interface Props {
	lowerLimit: number
	upperLimit: number
	values: any[]
}
export default class Histogram extends React.PureComponent<Props> {
	private canvasRef: React.RefObject<HTMLCanvasElement>
	private divRef: React.RefObject<HTMLDivElement>
	private ctx: CanvasRenderingContext2D

	constructor(props: Props) {
		super(props)
		this.canvasRef = React.createRef()
		this.divRef = React.createRef()
	}

	componentDidMount() {
		this.ctx = this.canvasRef.current.getContext('2d')
		const { width, height } = this.divRef.current.getBoundingClientRect()
		this.canvasRef.current.width = width
		this.canvasRef.current.height = height
	}

	componentDidUpdate(prevProps: Props) {
		if (this.ctx != null && this.props.values.length && prevProps.values !== this.props.values) {
			const values = this.props.values.map(value => value.doc_count)


			const canvas = this.drawChart(ChartType.Bar, values, 24)
			// const canvas = this.drawChart(ChartType.Horizon, values)

			this.ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height)
			this.ctx.drawImage(canvas, 0, 0, this.canvasRef.current.width, this.canvasRef.current.height)
		}
	}

	render() {
		return (
			<div
				ref={this.divRef}
				style={{
					height: '60px',
					position: 'relative',
				}}
			>
				<div
					style={{
						background: 'rgba(255, 255, 255, .2)',
						height: '100%',
						left: `${this.props.lowerLimit * 100}%`,
						mixBlendMode: 'difference',
						position: 'absolute',
						width: `${(this.props.upperLimit - this.props.lowerLimit) * 100}%`,
					}}
				/>
				<canvas ref={this.canvasRef} />
			</div>
		)
	}

	private drawChart(chartType: ChartType, values: any[], maxBars?: number) {
		if (maxBars != null && values.length > maxBars) {
			const valuesPerBar = Math.ceil(values.length/maxBars)
			values = values.reduce((prev, _curr, index, array) => {
				if (index > 0 && index % valuesPerBar === 0) {
					const arr = array.slice(index - valuesPerBar, index)
					const sum = arr.reduce((prev, curr) => prev + curr)
					prev.push(sum/valuesPerBar)
				}
				return prev	
			}, [])	
		}

		const barWidth = Math.ceil(this.canvasRef.current.width / values.length)
		const maxValue = values.reduce((prev, curr) => Math.max(prev, curr))

		const canvas = document.createElement('canvas')
		canvas.width = barWidth * values.length
		canvas.height = this.canvasRef.current.height
		const ctx = canvas.getContext('2d')

		if (chartType === ChartType.Bar) {
			this.drawBarChart(canvas, ctx, values, maxValue, barWidth)
		} else if (chartType === ChartType.Horizon) {
			this.drawHorizonChart(canvas, ctx, values, maxValue, barWidth)
		}

		return canvas
	}

	private drawBarChart(canvas: any, ctx: any, values: any[], maxValue: any, barWidth: any) {
		ctx.fillStyle = "#DDD"

		for (let i = 0; i < values.length; i++) {
			const value = values[i]
			const barHeight = Math.round((value/maxValue) * canvas.height)
			const y = Math.round(canvas.height - barHeight)
			ctx.fillRect(i * barWidth + 1, y, barWidth - 2, barHeight)
		}
	}

	private drawHorizonChart(canvas: any, ctx: any, values: any[], maxValue: any, barWidth: any) {
		for (let i = 0; i < values.length; i++) {
			const value = values[i]
			ctx.fillStyle = `rgba(0, 0, 0, ${value/maxValue})`
			ctx.fillRect(i * barWidth, 0, barWidth, canvas.height)
		}
	}
}