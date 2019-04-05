export declare enum FacetType {
    Boolean = 0,
    List = 1,
    Range = 2
}
export declare enum SortBy {
    Count = "_count",
    Key = "_term"
}
export declare enum SortDirection {
    Asc = "asc",
    Desc = "desc"
}
export declare class Facet {
    field: string;
    index: number;
    type: FacetType;
    id: string;
    constructor(field: string, index: number, type: FacetType);
}
export interface ListFacetValue {
    key: string;
    doc_count: number;
}
export declare class ListFacet extends Facet {
    size: number;
    filters: Set<string>;
    order: [SortBy, SortDirection];
    query: string;
    total: number;
    values: ListFacetValue[];
    viewSize: number;
    constructor(field: string, index: number, size: number);
    viewLess(): void;
    viewMore(): void;
}
export declare class BooleanFacet extends Facet {
    filters: Set<string>;
    values: ListFacetValue[];
    constructor(field: string, index: number);
}
export declare class RangeFacet extends Facet {
    filter: [number, number];
    histogramValues: any[];
    values: [number, number];
    constructor(field: string, index: number);
}
export declare type Facets = Map<string, BooleanFacet | ListFacet | RangeFacet>;
