import * as React from 'react';
declare type Props = Pick<AppProps, 'onClickResult' | 'ResultBodyComponent' | 'resultBodyProps' | 'resultsPerPage'> & {
    currentPage: number;
    dispatch: React.Dispatch<FacetsDataReducerAction>;
    facetsData: FacetsData;
    searchResult: FSResponse;
    setCurrentPage: (pageNumber: number) => void;
    setSortOrder: SetSortOrder;
    sortOrder: SortOrder;
};
declare function HucSearchResults(props: Props): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof HucSearchResults>;
export default _default;
