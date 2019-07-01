export default class IOManager {
    private options;
    private backend;
    private cache;
    private hitsCache;
    private lastRequest;
    currentPage: number;
    constructor(options: Options);
    sendRequest(facets: Facet[], query: string): Promise<void>;
    private handleFetch;
    private updateHitsCache;
    private fetch;
    goToPage: (pageNumber: number, facets: Facet[]) => Promise<void>;
    getPrevNext(id: string): [Hit, Hit];
}
