import * as React from 'react';
interface Props {
    dispatch: React.Dispatch<FacetsDataReducerAction>;
    filter: ActiveFilter;
}
declare function ActiveFilter(props: Props): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof ActiveFilter>;
export default _default;
