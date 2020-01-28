export declare const SPOT_COLOR = "#08c";
export declare const BACKGROUND_GRAY = "#f6f6f6";
export declare function fetchSearchResults(url: string, request: any): Promise<any>;
export declare function isBooleanFacet(facetConfig: FacetConfigBase): facetConfig is BooleanFacetConfig;
export declare function isDateFacet(facetConfig: FacetConfigBase): facetConfig is DateFacetConfig;
export declare function isListFacet(facetConfig: FacetConfigBase): facetConfig is ListFacetConfig;
export declare function isRangeFacet(facetConfig: FacetConfigBase): facetConfig is RangeFacetConfig;
