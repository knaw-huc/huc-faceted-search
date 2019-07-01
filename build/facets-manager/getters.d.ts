import { BooleanFacet, ListFacet, RangeFacet } from '../models/facet';
export default class FacetGetter {
    private options;
    protected facets: Facets;
    facetCount: number;
    query: string;
    constructor(options: {
        onChange: OnFacetManagerChange;
    });
    getFacets(): Facet[];
    getFacets(type: FacetType.Boolean): BooleanFacet[];
    getFacets(type: FacetType.List): ListFacet[];
    getFacets(type: FacetType.Range): RangeFacet[];
    getFacet(field: string): Facet;
    getBooleanFacet(field: string): BooleanFacet;
    getRangeFacet(field: string): RangeFacet;
    getListFacet(field: string): ListFacet;
    setBooleanFacet(field: string, index: number, settings: BooleanSettings): void;
    setListFacet(field: string, index: number, settings: ListSettings): void;
    setRangeFacet(field: string, index: number, settings: RangeSettings): void;
    protected handleChange(): void;
}
