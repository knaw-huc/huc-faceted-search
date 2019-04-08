"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const full_text_search_1 = require("../full-text-search");
const facet_1 = require("../../models/facet");
const Wrapper = styled_1.default('div') `
	font-size: .9em;
	margin-bottom: 2em;
`;
const RadioGroup = styled_1.default('div') `
	border: 1px solid #AAA;
	display: grid;
	grid-template-columns: 1fr 1fr;
	padding: 1em;
`;
const Div = styled_1.default('div') `
	list-style: none;
	display: grid;
	grid-template-columns: 24px 1fr;
	grid-template-rows: 1fr 1fr;
`;
const H4 = styled_1.default('h4') `
	color: gray;
	font-weight: normal;
	margin: 1em 0 .2em 0;
	padding: 0;
`;
class Options extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            value: ''
        };
        this.sortBy = (sortBy, direction) => {
            return (ev) => {
                if (ev.target.value === 'on') {
                    this.props.state.facetsManager.sortListBy(this.props.field, sortBy, direction);
                }
            };
        };
    }
    render() {
        return (React.createElement(Wrapper, null,
            React.createElement(H4, null, "Order"),
            React.createElement(RadioGroup, null,
                React.createElement(Div, null,
                    React.createElement("input", { defaultChecked: true, id: "highest-first-radio", name: "sort", onChange: this.sortBy(facet_1.SortBy.Count, facet_1.SortDirection.Desc), type: "radio" }),
                    React.createElement("label", { htmlFor: "highest-first-radio" }, "Highest first"),
                    React.createElement("input", { id: "lowest-first-radio", type: "radio", name: "sort", onChange: this.sortBy(facet_1.SortBy.Count, facet_1.SortDirection.Asc) }),
                    React.createElement("label", { htmlFor: "lowest-first-radio" }, "Lowest first")),
                React.createElement(Div, null,
                    React.createElement("input", { id: "az-radio", type: "radio", name: "sort", onChange: this.sortBy(facet_1.SortBy.Key, facet_1.SortDirection.Asc) }),
                    React.createElement("label", { htmlFor: "az-radio" }, "A - Z"),
                    React.createElement("input", { id: "za-radio", name: "sort", onChange: this.sortBy(facet_1.SortBy.Key, facet_1.SortDirection.Desc), type: "radio" }),
                    React.createElement("label", { htmlFor: "za-radio" }, "Z - A"))),
            React.createElement(H4, null, "Filter"),
            React.createElement(full_text_search_1.Input, { onChange: (ev) => {
                    const { value } = ev.target;
                    this.setState({ value });
                    this.props.state.facetsManager.addListFilterQuery(this.props.field, value);
                }, style: {
                    border: '1px solid #AAA',
                    height: '2em',
                    width: '100%',
                }, type: "text", value: this.state.value })));
    }
}
exports.default = Options;
