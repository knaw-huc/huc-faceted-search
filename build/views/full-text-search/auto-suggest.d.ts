import * as React from 'react';
interface Props {
    autoSuggest: (query: string) => Promise<string[]>;
    onClick: (query: string) => void;
    value: string;
}
interface State {
    suggestions: string[];
}
export default class AutoSuggest extends React.PureComponent<Props, State> {
    state: State;
    componentDidUpdate(prevProps: Props, prevState: State): Promise<void>;
    render(): JSX.Element;
}
export {};
