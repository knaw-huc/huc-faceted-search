import { RangeFacet } from '../models/facet';
import FacetManager from './facet-manager';
export default class RangeManger extends FacetManager<RangeFacet> {
    addFacet(field: string, index: number): void;
    addFilter(field: string, min: number, max: number): void;
    reset(): void;
}
