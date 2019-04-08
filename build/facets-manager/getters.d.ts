import { BooleanFacet, ListFacet, RangeFacet } from '../models/facet';
export default class FacetGetter {
    protected facets: Facets;
    facetCount: number;
    query: string;
    onChange: OnFacetManagerChange;
    getFacets(): Facet[];
    getFacets(type: FacetType.Boolean): BooleanFacet[];
    getFacets(type: FacetType.List): ListFacet[];
    getFacets(type: FacetType.Range): RangeFacet[];
    getBooleanFacet(field: string): BooleanFacet;
    getRangeFacet(field: string): RangeFacet;
    getListFacet(field: string): ListFacet;
    setBooleanFacet(field: string, index: number, settings: BooleanSettings): void;
    setListFacet(field: string, index: number, settings: ListSettings): void;
    setRangeFacet(field: string, index: number, settings: RangeSettings): void;
    protected handleChange(): void;
}
