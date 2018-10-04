import * as React from 'react';
interface Props {
    style: React.CSSProperties;
}
interface FacetState {
    collapsed: boolean;
    focus: boolean;
}
export default class Facet extends React.PureComponent<Props, FacetState> {
    state: FacetState;
    static defaultProps: {
        style: {};
    };
    toggleState(field: keyof FacetState): void;
    render(): JSX.Element;
}
export {};
