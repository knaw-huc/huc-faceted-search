import * as React from 'react';
declare type Props = Pick<AppProps, 'fields' | 'onClickResult' | 'ResultBodyComponent' | 'resultBodyProps' | 'resultsPerPage'> & {
    currentPage: number;
    searchResult: FSResponse;
    setCurrentPage: (pageNumber: number) => void;
    setSortOrder: SetSortOrder;
    sortOrder: SortOrder;
};
declare function HucSearchResults(props: Props): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof HucSearchResults>;
export default _default;
