import ElasticSearchRequest from "./elasticsearch/request-creator"
import ElasticSearchResponseParser from "./elasticsearch/response-parser"
import { NoneRequestCreator, NoneResponseParser } from './none'

export type BackendType = 'none' | 'elasticsearch'
export type Backend = {
	RequestCreator: any
	ResponseParser: any
}

const backends: Record<BackendType, Backend> = {
	none: {
		RequestCreator: NoneRequestCreator,
		ResponseParser: NoneResponseParser,
	},
	elasticsearch: {
		RequestCreator: ElasticSearchRequest,
		ResponseParser: ElasticSearchResponseParser,
	}
}

export default backends