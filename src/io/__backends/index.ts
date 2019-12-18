import ElasticSearchRequest from "./elasticsearch/request-creator"
import elasticSearchResponseParser from "./elasticsearch/response-parser"
import { NoneRequestCreator, noneResponseParser } from './none'

const backends: Record<BackendType, Backend> = {
	none: {
		RequestCreator: NoneRequestCreator,
		responseParser: noneResponseParser,
	},
	elasticsearch: {
		RequestCreator: ElasticSearchRequest,
		responseParser: elasticSearchResponseParser,
	}
}

export default backends
