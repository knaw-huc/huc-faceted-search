import * as React from 'react';
import { ContextState } from '../../context';
export declare const Wrapper: any;
export declare const Input: any;
interface ConsumerProps {
    state: ContextState;
}
interface Props {
    autoSuggest: (query: string) => Promise<string[]>;
}
interface State {
    suggest: boolean;
    value: string;
}
declare class FullTextSearch extends React.PureComponent<Props & ConsumerProps, State> {
    state: {
        suggest: boolean;
        value: string;
    };
    render(): JSX.Element;
    addQuery: (query: string) => void;
    private _addQuery;
    private requestAddQuery;
}
declare const _default: React.ForwardRefExoticComponent<Props & React.RefAttributes<FullTextSearch>>;
export default _default;
