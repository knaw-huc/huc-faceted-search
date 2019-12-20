export declare function ratioToTimestamp(ratio: number, values: RangeFacetValues): number;
export declare function timestampToRatio(timestamp: number, values: RangeFacetValues): number;
export declare function formatRange(facetData: RangeFacetData, rangeMin: number, rangeMax: number): [number | string, number | string];
export declare function formatDate(facetData: RangeFacetData, num: number, sameYear?: boolean): string | number;
