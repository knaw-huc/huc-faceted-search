"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const components_1 = require("./components");
function HucSearchResults(props) {
    return (React.createElement(components_1.Section, { id: "huc-fs-search-results" },
        React.createElement(components_1.ResultList, null, props.searchResult.results.map((hit, i) => React.createElement(components_1.Result, { key: i, onClick: (ev) => {
                if (props.onClickResult != null)
                    props.onClickResult(hit, ev);
            } },
            React.createElement(props.ResultBodyComponent, Object.assign({}, props.resultBodyProps, { result: hit })))))));
}
exports.default = React.memo(HucSearchResults);
