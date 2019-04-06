import { BooleanFacet, ListFacet, RangeFacet, FacetType, Facets, Facet } from '../models/facet';
export default class FacetGetter {
    facets: Facets;
    getFacets(): Facet[];
    getFacets(type: FacetType.Boolean): BooleanFacet[];
    getFacets(type: FacetType.List): ListFacet[];
    getFacets(type: FacetType.Range): RangeFacet[];
    getBooleanFacet(field: string): BooleanFacet;
    getRangeFacet(field: string): RangeFacet;
    getListFacet(field: string): ListFacet;
}
