import * as React from 'react';
export declare const VIEW_BOX_WIDTH = 400;
interface IOnChangeData extends State {
    refresh: boolean;
}
declare enum ActiveElement {
    Bar = 0,
    LowerLimit = 1,
    UpperLimit = 2
}
interface Props {
    handleRadius?: number;
    lineWidth?: number;
    lowerLimit?: number;
    onChange: (data: IOnChangeData) => void;
    style: React.CSSProperties;
    upperLimit?: number;
}
interface State {
    activeElement: ActiveElement;
    lowerLimit?: number;
    upperLimit?: number;
}
declare class RangeSlider extends React.Component<Props, State> {
    private mouseState;
    private svgRef;
    state: State;
    static defaultProps: Partial<Props>;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: Props): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private getPositionForLimit;
    private setRange;
    private mouseDown;
    private mouseMove;
    private touchMove;
    private mouseUp;
    private getRangeLine;
    private getCurrentRangeLine;
}
export default RangeSlider;
