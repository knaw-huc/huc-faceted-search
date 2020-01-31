import * as React from 'react';
interface Props {
    clearActiveFilters: () => void;
    dispatch: React.Dispatch<FacetsDataReducerAction>;
    facetsData: FacetsData;
}
declare function ActiveFilters(props: Props): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof ActiveFilters>;
export default _default;
