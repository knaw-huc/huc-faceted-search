declare abstract class BaseFacet {
    field: string;
    index: number;
    type: FacetType;
    id: string;
    constructor(field: string, index: number, type: FacetType);
}
export declare class ListFacet extends BaseFacet {
    settings: ListSettings;
    filters: Set<string>;
    order: [SortBy, SortDirection];
    query: string;
    total: number;
    type: FacetType;
    values: ListFacetValue[];
    viewSize: number;
    constructor(field: string, index: number, settings: ListSettings);
    viewLess(): void;
    viewMore(): void;
}
export declare class BooleanFacet extends BaseFacet {
    settings: BooleanSettings;
    filters: Set<string>;
    type: FacetType;
    values: ListFacetValue[];
    constructor(field: string, index: number, settings: BooleanSettings);
}
export declare class RangeFacet extends BaseFacet {
    settings: RangeSettings;
    filter: [number, number];
    histogramValues: any[];
    type: FacetType.Range;
    values: [number, number];
    constructor(field: string, index: number, settings: RangeSettings);
}
export {};
