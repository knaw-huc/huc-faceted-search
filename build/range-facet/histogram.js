"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
var ChartType;
(function (ChartType) {
    ChartType[ChartType["Bar"] = 0] = "Bar";
    ChartType[ChartType["Horizon"] = 1] = "Horizon";
})(ChartType || (ChartType = {}));
class Histogram extends React.PureComponent {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.divRef = React.createRef();
    }
    componentDidMount() {
        this.ctx = this.canvasRef.current.getContext('2d');
        const { width, height } = this.divRef.current.getBoundingClientRect();
        this.canvasRef.current.width = width;
        this.canvasRef.current.height = height;
    }
    componentDidUpdate(prevProps) {
        if (this.ctx != null && this.props.values.length && prevProps.values !== this.props.values) {
            const values = this.props.values.map(value => value.doc_count);
            const canvas = this.drawChart(ChartType.Bar, values, 12);
            this.ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
            this.ctx.drawImage(canvas, 0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
        }
    }
    render() {
        return (React.createElement("div", { ref: this.divRef, style: {
                height: '60px',
                position: 'relative',
            } },
            React.createElement("div", { style: {
                    background: 'rgba(255, 255, 255, .2)',
                    height: '100%',
                    left: `${this.props.lowerLimit * 100}%`,
                    mixBlendMode: 'difference',
                    position: 'absolute',
                    width: `${(this.props.upperLimit - this.props.lowerLimit) * 100}%`,
                } }),
            React.createElement("canvas", { ref: this.canvasRef })));
    }
    drawChart(chartType, values, maxBars) {
        if (maxBars != null && values.length > maxBars) {
            const valuesPerBar = Math.ceil(values.length / maxBars);
            values = values.reduce((prev, _curr, index, array) => {
                if (index > 0 && index % valuesPerBar === 0) {
                    const arr = array.slice(index - valuesPerBar, index);
                    const sum = arr.reduce((prev, curr) => prev + curr);
                    prev.push(sum / valuesPerBar);
                }
                return prev;
            }, []);
        }
        const barWidth = Math.ceil(this.canvasRef.current.width / values.length);
        const maxValue = values.reduce((prev, curr) => Math.max(prev, curr));
        const canvas = document.createElement('canvas');
        canvas.width = barWidth * values.length;
        canvas.height = this.canvasRef.current.height;
        const ctx = canvas.getContext('2d');
        if (chartType === ChartType.Bar) {
            this.drawBarChart(canvas, ctx, values, maxValue, barWidth);
        }
        else if (chartType === ChartType.Horizon) {
            this.drawHorizonChart(canvas, ctx, values, maxValue, barWidth);
        }
        return canvas;
    }
    drawBarChart(canvas, ctx, values, maxValue, barWidth) {
        ctx.fillStyle = "#DDD";
        for (let i = 0; i < values.length; i++) {
            const value = values[i];
            const barHeight = Math.round((value / maxValue) * canvas.height);
            const y = Math.round(canvas.height - barHeight);
            ctx.fillRect(i * barWidth + 1, y, barWidth - 2, barHeight);
        }
    }
    drawHorizonChart(canvas, ctx, values, maxValue, barWidth) {
        for (let i = 0; i < values.length; i++) {
            const value = values[i];
            ctx.fillStyle = `rgba(0, 0, 0, ${value / maxValue})`;
            ctx.fillRect(i * barWidth, 0, barWidth, canvas.height);
        }
    }
}
exports.default = Histogram;
