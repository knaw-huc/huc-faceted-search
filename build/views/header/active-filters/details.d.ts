import * as React from 'react';
interface Props {
    dispatch: React.Dispatch<FacetsDataReducerAction>;
    filters: ActiveFilter[];
}
declare function ActiveFiltersDetails(props: Props): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof ActiveFiltersDetails>;
export default _default;
