"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const facet_1 = tslib_1.__importDefault(require("../facet"));
const values_1 = tslib_1.__importDefault(require("./values"));
const facet_header_1 = tslib_1.__importDefault(require("../facet-header"));
class ListFacet extends React.PureComponent {
    componentDidMount() {
        this.props.state.facetsManager.booleanManager.addFacet(this.props.field, this.props.index);
    }
    render() {
        return (React.createElement(facet_1.default, null,
            React.createElement(facet_header_1.default, Object.assign({}, this.props)),
            React.createElement(values_1.default, Object.assign({}, this.props, this.state))));
    }
}
ListFacet.defaultProps = {
    labels: ["No", "Yes"]
};
exports.default = ListFacet;
