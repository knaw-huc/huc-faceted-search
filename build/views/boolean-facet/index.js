"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const facet_1 = tslib_1.__importDefault(require("../facet"));
const values_1 = tslib_1.__importDefault(require("./values"));
const facet_header_1 = tslib_1.__importDefault(require("../facet-header"));
class BooleanFacet extends React.PureComponent {
    componentDidMount() {
        this.props.state.facetsManager.setBooleanFacet(this.props.field, this.props.index, {});
    }
    render() {
        return (React.createElement(facet_1.default, null,
            React.createElement(facet_header_1.default, Object.assign({}, this.props)),
            React.createElement(values_1.default, { facet: this.props.state.facetsManager.getBooleanFacet(this.props.field), field: this.props.field, labels: this.props.labels, state: this.props.state })));
    }
}
BooleanFacet.defaultProps = {
    labels: ["No", "Yes"]
};
exports.default = BooleanFacet;
