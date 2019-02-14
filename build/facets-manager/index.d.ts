import RangeManager from './range-manager';
import ListFacetManager from './list-manager';
import BooleanFacetManager from './boolean-manager';
import { Facets } from '../models/facet';
export default class FacetsManager {
    private onChange;
    query: string;
    facetCount: number;
    booleanManager: BooleanFacetManager;
    listManager: ListFacetManager;
    rangeManager: RangeManager;
    request: any;
    constructor(onChange: (facets: Facets, query: string) => void);
    private handleChange;
    addQuery(query: string): void;
    reset(): void;
    setFacetCount(count: number): void;
}
