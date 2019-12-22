import * as React from 'react';
declare type Props = Pick<RangeFacetProps, 'facetData' | 'facetsDataDispatch' | 'values'> & {
    lowerLimit: number;
    upperLimit: number;
};
declare function Histogram(props: Props): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof Histogram>;
export default _default;
