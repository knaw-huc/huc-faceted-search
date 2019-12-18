import * as React from 'react';
interface Props {
    currentPage: number;
    pageNumber: number;
    setCurrentPage: () => void;
}
declare function PageNumber(props: Props): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof PageNumber>;
export default _default;
