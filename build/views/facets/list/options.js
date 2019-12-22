"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const full_text_search_1 = require("../../full-text-search");
const lodash_debounce_1 = tslib_1.__importDefault(require("lodash.debounce"));
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
const FilterInput = styled_1.default(full_text_search_1.Input) `
	border: 1px solid #AAA;
	height: 2em;
	width: 100%;
`;
function Options(props) {
    const [filterInputValue, setFilterInputValue] = React.useState('');
    const handleHighestFirstChange = React.useCallback(() => props.facetsDataDispatch({ type: 'set_sort', facetId: props.facetData.id, by: "_count", direction: "desc" }), [props.facetData.id]);
    const handleLowestFirstChange = React.useCallback(() => props.facetsDataDispatch({ type: 'set_sort', facetId: props.facetData.id, by: "_count", direction: "asc" }), [props.facetData.id]);
    const handleZaChange = React.useCallback(() => props.facetsDataDispatch({ type: 'set_sort', facetId: props.facetData.id, by: "_term", direction: "desc" }), [props.facetData.id]);
    const handleAzChange = React.useCallback(() => props.facetsDataDispatch({ type: 'set_sort', facetId: props.facetData.id, by: "_term", direction: "asc" }), [props.facetData.id]);
    const setQuery = lodash_debounce_1.default((value) => props.facetsDataDispatch({ type: 'set_query', facetId: props.facetData.id, value }), 600);
    const handleFilterInputChange = React.useCallback((ev) => {
        setFilterInputValue(ev.target.value);
        setQuery(ev.target.value);
    }, []);
    return (React.createElement(Wrapper, null,
        React.createElement(H4, null, "Order"),
        React.createElement(RadioGroup, null,
            React.createElement(Div, null,
                React.createElement("input", { defaultChecked: true, id: "highest-first-radio", name: "sort", onChange: handleHighestFirstChange, type: "radio" }),
                React.createElement("label", { htmlFor: "highest-first-radio" }, "Highest first"),
                React.createElement("input", { id: "lowest-first-radio", type: "radio", name: "sort", onChange: handleLowestFirstChange }),
                React.createElement("label", { htmlFor: "lowest-first-radio" }, "Lowest first")),
            React.createElement(Div, null,
                React.createElement("input", { id: "az-radio", type: "radio", name: "sort", onChange: handleAzChange }),
                React.createElement("label", { htmlFor: "az-radio" }, "A - Z"),
                React.createElement("input", { id: "za-radio", name: "sort", onChange: handleZaChange, type: "radio" }),
                React.createElement("label", { htmlFor: "za-radio" }, "Z - A"))),
        React.createElement(H4, null, "Filter"),
        React.createElement(FilterInput, { onChange: handleFilterInputChange, type: "text", value: filterInputValue })));
}
exports.default = React.memo(Options);
