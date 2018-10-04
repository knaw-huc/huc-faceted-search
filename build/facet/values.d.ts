import * as React from 'react';
import { IFacetValue } from './value';
import { FacetProps, FacetState } from './index';
declare type Props = FacetProps & FacetState;
interface State {
    values: IFacetValue[];
}
export default class FacetValues extends React.PureComponent<Props, State> {
    private wrapperRef;
    private listHeight;
    state: State;
    constructor(props: Props);
    static getDerivedStateFromProps(props: Props): {
        values: IFacetValue[];
    };
    componentDidUpdate(prevProps: Props, prevState: State): void;
    render(): JSX.Element;
    private animate;
    private setHeight;
}
export {};
