/// <reference types="react" />
interface Props {
    onMouseDown: (ev: any) => void;
    onTouchStart: (ev: any) => void;
    percentage: number;
    radius: number;
    strokeWidth: number;
}
declare const _default: (props: Props) => JSX.Element;
export default _default;
