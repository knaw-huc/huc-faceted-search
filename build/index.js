"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const list_facet_1 = tslib_1.__importDefault(require("./views/list-facet"));
const reset_1 = tslib_1.__importDefault(require("./views/reset"));
const request_creator_1 = tslib_1.__importDefault(require("./io-manager/backends/elasticsearch/request-creator"));
const io_manager_1 = require("./io-manager");
const response_parser_1 = tslib_1.__importDefault(require("./io-manager/backends/elasticsearch/response-parser"));
const Wrapper = styled_1.default.div `
	margin-bottom: 10vh;

	${(props) => {
    if (!props.disableDefaultStyle) {
        return `
				display: grid;
				font-family: sans-serif;
				grid-template-columns: minmax(32px, auto) 352px minmax(320px, 672px) minmax(32px, auto);
				
				& > aside {
					grid-column: 2;
					padding-right: 32px;
				}

				& > section {
					grid-column: 3;
					padding-left: 32px;
				}
			`;
    }
}}
`;
function facetSortsReducer(facetSorts, action) {
    switch (action.type) {
        case 'set': {
            const { by, direction } = action;
            facetSorts.set(action.field, { by, direction });
            return new Map(facetSorts);
        }
        case 'clear': {
            return new Map();
        }
    }
    return facetSorts;
}
function filtersReducer(filters, action) {
    switch (action.type) {
        case 'add': {
            if (filters.has(action.field)) {
                filters.get(action.field).add(action.value);
                return new Map(filters);
            }
            filters.set(action.field, new Set([action.value]));
            return new Map(filters);
        }
        case 'remove': {
            if (filters.has(action.field)) {
                const values = filters.get(action.field);
                values.delete(action.value);
                if (!values.size)
                    filters.delete(action.field);
                return new Map(filters);
            }
            break;
        }
        case 'clear': {
            return new Map();
        }
    }
    return filters;
}
function useSearchResult(props, filters, sorts) {
    const [searchResult, setSearchResult] = React.useState(null);
    React.useEffect(() => {
        const searchRequest = new request_creator_1.default(props.fields, props.resultFields, filters, sorts);
        io_manager_1.fetchSearchResults(props.url, searchRequest)
            .then(result => {
            const searchResponse = response_parser_1.default(result, props.fields);
            setSearchResult(searchResponse);
        })
            .catch(err => {
            console.log(err);
        });
    }, [props.resultFields, props.url, filters]);
    return searchResult;
}
exports.default = React.memo(function FacetedSearch(props) {
    const [filters, filtersDispatch] = React.useReducer(filtersReducer, new Map());
    const [facetSorts, facetSortsDispatch] = React.useReducer(facetSortsReducer, new Map());
    const searchResult = useSearchResult(props, filters, facetSorts);
    return (React.createElement(Wrapper, { className: props.className, disableDefaultStyle: props.disableDefaultStyle, id: "huc-fs" },
        React.createElement("aside", null,
            React.createElement(reset_1.default, { onClick: () => filtersDispatch({ type: 'clear' }) }),
            React.createElement("div", null, props.fields.map(facetConfig => {
                var _a;
                if (facetConfig.datatype === "keyword") {
                    return (React.createElement(list_facet_1.default, Object.assign({}, facetConfig, { addFilter: (field, value) => filtersDispatch({ type: 'add', field, value }), key: facetConfig.id, filters: filters.get(facetConfig.id), removeFilter: (field, value) => filtersDispatch({ type: 'remove', field, value }), sortListFacet: (field, by, direction) => facetSortsDispatch(({ type: 'set', field, by, direction })), title: facetConfig.title || facetConfig.id.charAt(0).toUpperCase() + facetConfig.id.slice(1), values: (_a = searchResult) === null || _a === void 0 ? void 0 : _a.facetValues[facetConfig.id] })));
                }
                else {
                    return null;
                }
            })))));
});
