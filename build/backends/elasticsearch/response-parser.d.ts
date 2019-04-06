import FacetsManager from '../../facets-manager';
export interface ParsedResponse {
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
    private facetsManager;
    parsedResponse: ParsedResponse;
    constructor(response: ElasticSearchResponse, facetsManager: FacetsManager);
    private parseResponse;
    private updateBooleanFacets;
    private updateListFacets;
    private updateRangeFacets;
}
