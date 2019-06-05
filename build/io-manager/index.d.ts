import FacetManager from '../facets-manager';
export default class IOManager {
    private options;
    private facetsManager;
    private backend;
    private cache;
    private hitsCache;
    private lastRequest;
    currentPage: number;
    onChange: OnIOManagerChange;
    constructor(options: Options, facetsManager: FacetManager);
    private handleFetch;
    private updateHitsCache;
    private fetch;
    goToPage: (pageNumber: number) => Promise<void>;
    getPrevNext(id: string): [Hit, Hit];
}
