import * as React from 'react';
interface Props {
    active: boolean;
    addFilter: () => void;
    keyFormatter?: (key: string | number) => string;
    removeFilter: () => void;
    value: KeyCount;
}
declare function FacetValueView(props: Props): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof FacetValueView>;
export default _default;
