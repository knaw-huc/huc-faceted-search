import * as React from "react";
interface Props {
    onClick: (query: string) => void;
    value: string;
}
interface State {
    hover: boolean;
}
export default class Suggestion extends React.Component<Props, State> {
    state: {
        hover: boolean;
    };
    render(): JSX.Element;
}
export {};
