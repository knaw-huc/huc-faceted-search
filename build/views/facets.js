"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const context_1 = require("../context");
class Facets extends React.PureComponent {
    componentDidMount() {
        if (Array.isArray(this.props.children)) {
            this.props.state.ioManager.setFacetCount(this.props.children.length);
        }
    }
    render() {
        return this.props.children;
    }
}
exports.default = (props) => (React.createElement(context_1.default.Consumer, null, state => React.createElement(Facets, { state: state }, React.Children.map(props.children, (child, index) => {
    return React.cloneElement(child, { state, index });
}))));
