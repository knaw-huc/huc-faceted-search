import { BooleanFacet } from '../models/facet';
import FacetManager from './facet-manager';
export default class BooleanManager extends FacetManager<BooleanFacet> {
    addFacet(field: string, index: number): void;
    addFilter(field: string, key: string): void;
    removeFilter(field: string, key: string): void;
    reset(): void;
}
