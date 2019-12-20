export declare function isBooleanFacet(facetConfig: FacetConfig): facetConfig is BooleanFacetConfig;
export declare function isListFacet(facetConfig: FacetConfig): facetConfig is ListFacetConfig;
export declare function isRangeFacet(facetConfig: FacetConfig): facetConfig is RangeFacetConfig;
export declare function facetsDataReducerInit(fields: AppProps['fields']): FacetsData;
export default function facetsDataReducer(facetsData: FacetsData, action: FacetsDataReducerAction): FacetsData;
