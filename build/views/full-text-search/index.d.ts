import * as React from 'react';
export declare const Input: import("create-emotion-styled/types/react").StyledOtherComponent<{}, React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, any>;
interface Props {
    autoSuggest: (query: string) => Promise<string[]>;
}
declare const _default: (props: Props) => JSX.Element;
export default _default;
