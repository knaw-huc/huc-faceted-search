import { Facets } from '../../models/facet';
interface ParsedResponse {
    aggregations: {
        [id: string]: any;
    };
    hits: any[];
    total: number;
}
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
    parsedResponse: ParsedResponse;
    constructor(response: ElasticSearchResponse, facets: Facets);
    private parseResponse;
    private updateBooleanFacets;
    private updateListFacets;
    private updateRangeFacets;
}
export {};
