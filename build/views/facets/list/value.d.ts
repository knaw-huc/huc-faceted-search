import * as React from 'react';
interface Props {
    active: boolean;
    facetId: string;
    facetsDataDispatch: React.Dispatch<FacetsDataReducerAction>;
    keyFormatter?: (key: string | number) => string;
    value: KeyCount;
}
declare function FacetValueView(props: Props): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof FacetValueView>;
export default _default;
