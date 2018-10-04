import * as React from 'react';
import { FacetsProps } from '../facets';
import { ListFacetProps } from './index';
declare type Props = FacetsProps & ListFacetProps;
interface State {
    value: string;
}
export default class Options extends React.PureComponent<Props, State> {
    state: State;
    render(): JSX.Element;
    private sortBy;
}
export {};
