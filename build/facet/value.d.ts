import * as React from 'react';
export interface IFacetValue {
    key: string;
    doc_count: number;
}
interface Props {
    addFilter: () => void;
    removeFilter: () => void;
    value: IFacetValue;
}
interface State {
    active: boolean;
}
export default class FacetValue extends React.PureComponent<Props, State> {
    state: State;
    toggleActive: () => void;
    render(): JSX.Element;
}
export {};
