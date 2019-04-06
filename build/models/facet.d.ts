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
export declare class BaseFacet {
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
export declare class ListFacet extends BaseFacet {
    size: number;
    filters: Set<string>;
    order: [SortBy, SortDirection];
    query: string;
    total: number;
    type: FacetType;
    values: ListFacetValue[];
    viewSize: number;
    constructor(field: string, index: number, size: number);
    viewLess(): void;
    viewMore(): void;
}
export declare class BooleanFacet extends BaseFacet {
    filters: Set<string>;
    type: FacetType;
    values: ListFacetValue[];
    constructor(field: string, index: number);
}
export declare class RangeFacet extends BaseFacet {
    filter: [number, number];
    histogramValues: any[];
    type: FacetType.Range;
    values: [number, number];
    constructor(field: string, index: number);
}
export declare type Facet = BooleanFacet | ListFacet | RangeFacet;
export declare type Facets = Map<string, Facet>;
