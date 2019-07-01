export declare abstract class BaseFacet {
    field: string;
    index: number;
    type: FacetType;
    id: string;
    constructor(field: string, index: number, type: FacetType);
    abstract reset(): void;
}
export declare class ListFacet extends BaseFacet {
    settings: ListSettings;
    filters: Set<string>;
    order: [SortBy, SortDirection];
    query: string;
    total: number;
    type: FacetType;
    values: ListFacetValues;
    viewSize: number;
    constructor(field: string, index: number, settings: ListSettings);
    reset(): void;
    viewLess(): void;
    viewMore(): void;
}
export declare class BooleanFacet extends BaseFacet {
    settings: BooleanSettings;
    filters: Set<string>;
    type: FacetType;
    values: BooleanFacetValues;
    constructor(field: string, index: number, settings: BooleanSettings);
    reset(): void;
}
export declare class RangeFacet extends BaseFacet {
    settings: RangeSettings;
    filter: [number, number];
    histogramValues: any[];
    type: FacetType.Range;
    values: RangeFacetValues;
    constructor(field: string, index: number, settings: RangeSettings);
    reset(): void;
}
