import FacetManager from '../facets-manager';
export default class IOManager {
    private options;
    private facetsManager;
    private backend;
    private cache;
    private history;
    onChange: OnIOManagerChange;
    constructor(options: Options, facetsManager: FacetManager);
    dispatch: () => Promise<void>;
    private handleFetch;
    private fetch;
    getNext(): Promise<void>;
}
