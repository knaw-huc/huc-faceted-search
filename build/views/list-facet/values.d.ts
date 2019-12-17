import * as React from 'react';
export declare type Props = {
    addFilter: (field: string, value: string) => void;
    collapse: boolean;
    field: string;
    filters: Set<string>;
    removeFilter: (field: string, value: string) => void;
    values: ListFacetValues;
};
declare function FacetValuesView(props: Props): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof FacetValuesView>;
export default _default;
