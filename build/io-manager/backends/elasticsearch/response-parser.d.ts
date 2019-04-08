import FacetManager from '../../../facets-manager';
export default class ElasticSearchResponseParser {
    private response;
    private facetsManager;
    parsedResponse: ParsedResponse;
    constructor(response: ElasticSearchResponse, facetsManager: FacetManager);
    private parseResponse;
    private updateBooleanFacets;
    private updateListFacets;
    private updateRangeFacets;
}
