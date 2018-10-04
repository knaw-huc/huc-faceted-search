import * as React from 'react';
import { FacetProps, FacetState } from './index';
interface Props extends FacetProps, FacetState {
    collapse: () => void;
}
export default class FacetHeader extends React.PureComponent<Props> {
    render(): JSX.Element;
}
export {};
