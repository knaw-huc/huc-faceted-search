import { Facets } from '../../models/facet';
export interface ElasticSearchResponse {
    aggregations: {
        [id: string]: any;
    };
    hits: {
        hits: {
            _source: any;
        }[];
        total: number;
    };
}
export default class ElasticSearchResponseParser {
    private response;
    facets: Facets;
    constructor(response: ElasticSearchResponse, facets: Facets);
    private updateListFacets;
    private updateRangeFacets;
}
