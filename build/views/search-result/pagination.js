"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const page_number_1 = tslib_1.__importStar(require("./page-number"));
function getRange(start, end) {
    return Array.from({ length: end - start + 1 }, (_value, key) => key + start);
}
const Wrapper = styled_1.default.div `
	color: #AAA;
	display: grid;
	grid-template-columns: 32px auto 32px;
	margin: 0 .2em 1em .2em;
`;
const Prev = styled_1.default(page_number_1.Button) `
	font-size: 1.6em;
	margin-top: -4px;
`;
const Next = styled_1.default(Prev) `
	text-align: right;
`;
const PageNumbers = styled_1.default.div `
	align-items: center;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(32px, 1fr));
	justify-items: center;
`;
function usePages(currentPage, pageCount) {
    const [first, setFirst] = React.useState([]);
    const [current, setCurrent] = React.useState([]);
    const [last, setLast] = React.useState([]);
    React.useEffect(() => {
        let first = [];
        let current = [];
        let last = [];
        if (pageCount < 10) {
            current = getRange(1, pageCount);
        }
        else {
            first = [1];
            last = [pageCount];
            if (currentPage < 6) {
                first = getRange(1, 7);
            }
            else if (currentPage > pageCount - 6) {
                last = getRange(pageCount - 6, pageCount);
            }
            else {
                current = getRange(currentPage - 2, currentPage + 2);
            }
        }
        setFirst(first);
        setCurrent(current);
        setLast(last);
    }, [currentPage, pageCount]);
    return { first, current, last };
}
function Pagination(props) {
    const pageCount = Math.ceil(props.searchResults.total / props.resultsPerPage);
    if (isNaN(pageCount) || pageCount === 1)
        return null;
    const { first, current, last } = usePages(props.currentPage, pageCount);
    const toPrev = React.useCallback(() => props.setCurrentPage(props.currentPage - 1), [props.currentPage]);
    const toNext = React.useCallback(() => props.setCurrentPage(props.currentPage + 1), [props.currentPage]);
    const toBetweenFirstAndCurrent = React.useCallback(() => {
        const nextPage = Math.round((first[first.length - 1] + current.concat(last)[0]) / 2);
        props.setCurrentPage(nextPage);
    }, [first, current, last]);
    const toBetweenCurrentAndLast = React.useCallback(() => {
        const lowerPageNumbers = first.concat(current);
        const nextPage = Math.round((lowerPageNumbers[lowerPageNumbers.length - 1] + last[0]) / 2);
        props.setCurrentPage(nextPage);
    }, [first, current, last]);
    const toPageNumber = React.useCallback((n) => (React.createElement(page_number_1.default, { currentPage: props.currentPage, key: n, pageNumber: n, setCurrentPage: () => props.setCurrentPage(n) })), [props.currentPage]);
    return (React.createElement(Wrapper, { className: "pagination" },
        props.currentPage !== 1 ?
            React.createElement(Prev, { onClick: toPrev }, "\u25C2") :
            React.createElement("div", null),
        React.createElement(PageNumbers, { className: "pagenumbers" },
            first.length > 0 && first.map(toPageNumber),
            first.length > 0 && current.length > 0 && React.createElement(page_number_1.Button, { onClick: toBetweenFirstAndCurrent }, "\u2026"),
            current.map(toPageNumber),
            last.length > 0 && React.createElement(page_number_1.Button, { onClick: toBetweenCurrentAndLast }, "\u2026"),
            last.length > 0 && last.map(toPageNumber)),
        props.currentPage !== pageCount ?
            React.createElement(Next, { onClick: toNext }, "\u25B8") :
            React.createElement("div", null)));
}
exports.default = React.memo(Pagination);
