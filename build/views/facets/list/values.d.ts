import * as React from 'react';
declare type Props = Pick<ListFacetProps, 'addFilter' | 'facetData' | 'removeFilter' | 'values' | 'viewLess' | 'viewMore'> & {
    collapse: boolean;
};
declare function FacetValuesView(props: Props): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof FacetValuesView>;
export default _default;
