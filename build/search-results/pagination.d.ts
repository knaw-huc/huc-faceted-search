import * as React from 'react';
import { ContextState } from '../context';
interface Props {
    goToPage: (pageNumber: number) => void;
    pageNumber: number;
    resultsPerPage: number;
    searchResults: ContextState['searchResult'];
}
export default class Pagination extends React.PureComponent<Props> {
    componentDidUpdate(prevProps: Props): void;
    render(): JSX.Element;
    private getPages;
    private toPageNumber;
    private handlePageNumberClick;
}
export {};
