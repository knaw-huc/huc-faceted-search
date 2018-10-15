import RangeManager from './range-manager';
import ListFacetManager from './list-manager';
import { Facets } from '../models/facet';
export default class FacetsManager {
    private onChange;
    query: string;
    facetCount: number;
    listManager: ListFacetManager;
    rangeManager: RangeManager;
    request: any;
    constructor(onChange: (facets: Facets, query: string) => void);
    private handleChange;
    addQuery(query: string): void;
    reset(): void;
    setFacetCount(count: number): void;
}
