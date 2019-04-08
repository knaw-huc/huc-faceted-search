import * as React from 'react';
interface Props {
    lowerLimit: number;
    upperLimit: number;
    values: any[];
}
export default class Histogram extends React.PureComponent<Props> {
    private canvasRef;
    private divRef;
    private ctx;
    static defaultProps: Pick<Props, 'values'>;
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props): void;
    render(): JSX.Element;
    private init;
    private drawChart;
    private drawBarChart;
    private drawHorizonChart;
}
export {};
