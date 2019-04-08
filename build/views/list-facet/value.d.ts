import * as React from 'react';
interface Props {
    active: boolean;
    addFilter: () => void;
    keyFormatter?: (key: string | number) => string;
    removeFilter: () => void;
    value: ListFacetValue;
}
interface State {
    active: boolean;
}
export default class FacetValueView extends React.PureComponent<Props, State> {
    state: State;
    static defaultProps: Partial<Props>;
    static getDerivedStateFromProps(props: Props): {
        active: boolean;
    };
    render(): JSX.Element;
    private toggleActive;
}
export {};
