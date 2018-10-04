import * as React from 'react';
interface Props {
    title: string;
}
interface State {
    focus: boolean;
}
export default class FacetHeader extends React.PureComponent<Props, State> {
    state: State;
    render(): JSX.Element;
}
export {};
