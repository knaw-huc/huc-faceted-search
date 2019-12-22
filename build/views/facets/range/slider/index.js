"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const handle_1 = tslib_1.__importDefault(require("./handle"));
exports.VIEW_BOX_WIDTH = 400;
var MouseState;
(function (MouseState) {
    MouseState[MouseState["Down"] = 0] = "Down";
    MouseState[MouseState["Up"] = 1] = "Up";
})(MouseState || (MouseState = {}));
var ActiveElement;
(function (ActiveElement) {
    ActiveElement[ActiveElement["Bar"] = 0] = "Bar";
    ActiveElement[ActiveElement["LowerLimit"] = 1] = "LowerLimit";
    ActiveElement[ActiveElement["UpperLimit"] = 2] = "UpperLimit";
})(ActiveElement || (ActiveElement = {}));
class RangeSlider extends React.Component {
    constructor(props) {
        super(props);
        this.mouseState = MouseState.Up;
        this.state = {
            activeElement: null,
            lowerLimit: this.props.lowerLimit,
            upperLimit: this.props.upperLimit,
        };
        this.mouseDown = (activeElement, ev) => {
            window.addEventListener('mousemove', this.mouseMove);
            this.mouseState = MouseState.Down;
            this.setState({ activeElement });
            return ev.preventDefault();
        };
        this.mouseMove = (ev) => {
            if (this.mouseState === MouseState.Down) {
                this.setRange(ev.pageX);
                return ev.preventDefault();
            }
        };
        this.touchMove = (ev) => {
            if (this.mouseState === MouseState.Down) {
                this.setRange(ev.touches[0].pageX);
                return ev.preventDefault();
            }
        };
        this.mouseUp = () => {
            window.removeEventListener('mousemove', this.mouseMove);
            if (this.mouseState === MouseState.Down) {
                this.props.onChange(Object.assign(Object.assign({}, this.state), { refresh: true }));
                this.setState({ activeElement: null });
            }
            this.mouseState = MouseState.Up;
        };
        this.svgRef = React.createRef();
    }
    componentDidMount() {
        window.addEventListener('mouseup', this.mouseUp);
        window.addEventListener('touchend', this.mouseUp);
        window.addEventListener('touchmove', this.touchMove);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            lowerLimit: nextProps.lowerLimit,
            upperLimit: nextProps.upperLimit,
        });
    }
    componentWillUnmount() {
        window.removeEventListener('mouseup', this.mouseUp);
        window.removeEventListener('touchend', this.mouseUp);
        window.removeEventListener('touchmove', this.touchMove);
    }
    render() {
        const handleOrder = this.state.activeElement === ActiveElement.LowerLimit ?
            [ActiveElement.UpperLimit, ActiveElement.LowerLimit] :
            [ActiveElement.LowerLimit, ActiveElement.UpperLimit];
        const viewBoxHeight = this.props.handleRadius * 2 + this.props.lineWidth;
        const viewBoxWidth = exports.VIEW_BOX_WIDTH + this.props.handleRadius * 2 + this.props.lineWidth;
        return (React.createElement("svg", { ref: this.svgRef, style: Object.assign({ boxSizing: 'border-box', padding: `${this.props.lineWidth / 2}px`, width: '100%' }, this.props.style), viewBox: `0 0 ${viewBoxWidth} ${viewBoxHeight}` },
            React.createElement("path", { d: this.getRangeLine(), fill: "transparent", stroke: "lightgray", strokeWidth: this.props.lineWidth }),
            React.createElement("g", { className: "current-range-line" },
                React.createElement("path", { stroke: "#AAA", strokeWidth: this.props.lineWidth, d: this.getCurrentRangeLine(), onMouseDown: (ev) => this.mouseDown(ActiveElement.Bar, ev), onTouchStart: (ev) => this.mouseDown(ActiveElement.Bar, ev) }),
                handleOrder.map(limit => React.createElement(handle_1.default, { key: limit, strokeWidth: this.props.lineWidth, onMouseDown: (ev) => this.mouseDown(limit, ev), onTouchStart: (ev) => this.mouseDown(limit, ev), percentage: limit === ActiveElement.LowerLimit ? this.state.lowerLimit : this.state.upperLimit, radius: this.props.handleRadius })))));
    }
    getPositionForLimit(pageX) {
        const rect = this.svgRef.current.getBoundingClientRect();
        if (rect.width > 0) {
            let percentage = (pageX - rect.left) / rect.width;
            if (percentage > 1) {
                percentage = 1;
            }
            else if (percentage < 0) {
                percentage = 0;
            }
            const center = (this.state.upperLimit + this.state.lowerLimit) / 2;
            if (this.state.activeElement === ActiveElement.Bar) {
                let lowerLimit = percentage + this.state.lowerLimit - center;
                let upperLimit = percentage - (center - this.state.upperLimit);
                if (upperLimit >= 1)
                    upperLimit = 1;
                if (lowerLimit <= 0)
                    lowerLimit = 0;
                return { lowerLimit, upperLimit };
            }
            else if (this.state.activeElement === ActiveElement.LowerLimit) {
                if (percentage >= this.state.upperLimit)
                    percentage = this.state.upperLimit;
                return { lowerLimit: percentage };
            }
            else if (this.state.activeElement === ActiveElement.UpperLimit) {
                if (percentage <= this.state.lowerLimit)
                    percentage = this.state.lowerLimit;
                return { upperLimit: percentage };
            }
        }
        return null;
    }
    setRange(pageX) {
        const posForLim = this.getPositionForLimit(pageX);
        if (posForLim !== null) {
            this.setState(posForLim);
        }
    }
    getRangeLine() {
        const { handleRadius: radius, lineWidth } = this.props;
        const strokeWidth = lineWidth / 2;
        const startX = radius + strokeWidth;
        const endX = exports.VIEW_BOX_WIDTH + radius + strokeWidth;
        const y = radius + strokeWidth;
        return `M${startX} ${y} L ${endX} ${y} Z`;
    }
    getCurrentRangeLine() {
        const { handleRadius: radius, lineWidth } = this.props;
        const strokeWidth = lineWidth / 2;
        const startX = radius + strokeWidth + Math.floor(this.state.lowerLimit * exports.VIEW_BOX_WIDTH);
        const endX = radius + strokeWidth + Math.ceil(this.state.upperLimit * exports.VIEW_BOX_WIDTH);
        const y = radius + strokeWidth;
        return `M${startX} ${y} L ${endX} ${y} Z`;
    }
}
RangeSlider.defaultProps = {
    handleRadius: 8,
    lineWidth: 4,
    lowerLimit: 0,
    style: {},
    upperLimit: 1,
};
exports.default = RangeSlider;
