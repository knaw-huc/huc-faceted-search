"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const backends_1 = tslib_1.__importDefault(require("./backends"));
class IOManager {
    constructor(options, facetsManager) {
        this.options = options;
        this.facetsManager = facetsManager;
        this.cache = {};
        this.history = [];
        this.dispatch = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const requestBody = new this.backend.RequestCreator(this.facetsManager);
            const response = yield this.handleFetch(requestBody);
            this.onChange(response);
        });
        this.backend = backends_1.default[options.backend];
        this.facetsManager.onChange = this.dispatch;
    }
    handleFetch(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const body = JSON.stringify(request);
            let response;
            if (this.cache.hasOwnProperty(body)) {
                response = JSON.parse(this.cache[body]);
            }
            else {
                response = yield this.fetch(body);
                this.cache[body] = JSON.stringify(response);
            }
            const responseParser = new this.backend.ResponseParser(response, this.facetsManager);
            this.history.push({ request: body, response: responseParser.parsedResponse });
            return {
                request,
                response: responseParser.parsedResponse,
                query: this.facetsManager.query
            };
        });
    }
    fetch(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let fetchResponse;
            let response;
            try {
                fetchResponse = yield fetch(this.options.url, {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body
                });
                response = yield fetchResponse.json();
            }
            catch (err) {
                throw ('Failed to fetched Faceted Search state');
            }
            return fetchResponse.status === 200 ? response : null;
        });
    }
    getNext() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.history.length)
                return;
            const lastItem = this.history[this.history.length - 1];
            const body = JSON.parse(lastItem.request);
            if (body.hasOwnProperty('from'))
                body.from += body.size;
            else
                body.from = body.size;
            const response = yield this.handleFetch(body);
            response.response.hits = lastItem.response.hits.concat(response.response.hits);
            this.onChange(response);
        });
    }
}
exports.default = IOManager;
