import { RangeFacet, ListFacet, BooleanFacet } from '../models/facet';

export default abstract class FacetManger<T extends RangeFacet | ListFacet | BooleanFacet> {
	facets: { [key: string]: T } = {}
	change: () => void = () => {}

	onChange(func: () => void) {
		this.change = func
	}

	abstract addFacet(field: string, index: number, thirdArg?: any): void
	abstract addFilter(field: string, secondArg?: any, thirdArg?: any): void
	abstract reset(): void
}