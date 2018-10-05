import * as React from 'react';
import { ListFacetValue } from '../models/facet';
interface Props {
    addFilter: () => void;
    removeFilter: () => void;
    value: ListFacetValue;
}
interface State {
    active: boolean;
}
export default class FacetValueView extends React.PureComponent<Props, State> {
    state: State;
    toggleActive: () => void;
    render(): JSX.Element;
}
export {};
