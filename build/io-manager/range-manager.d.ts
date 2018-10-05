import { RangeFacet } from '../models/facet';
export default class RangeManger {
    facets: {
        [key: string]: RangeFacet;
    };
    addFacet(field: string, index: number): void;
    addFilter(field: string, min: number, max: number): void;
    reset(): void;
}
