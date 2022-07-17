"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const url_1 = __importDefault(require("url"));
const axios_1 = __importDefault(require("axios"));
const app_1 = __importDefault(require("../src/app"));
const port = app_1.default.get('port') || 8998;
const getUrl = (pathname) => url_1.default.format({
    hostname: app_1.default.get('host') || 'localhost',
    protocol: 'http',
    port,
    pathname
});
describe('Feathers application tests', () => {
    let server;
    before(function (done) {
        server = app_1.default.listen(port);
        server.once('listening', () => done());
    });
    after(function (done) {
        server.close(done);
    });
    it('starts and shows the index page', async () => {
        const { data } = await axios_1.default.get(getUrl());
        assert_1.default.ok(data.indexOf('<html lang="en">') !== -1);
    });
    describe('404', function () {
        it('shows a 404 HTML page', async () => {
            try {
                await axios_1.default.get(getUrl('path/to/nowhere'), {
                    headers: {
                        'Accept': 'text/html'
                    }
                });
                assert_1.default.fail('should never get here');
            }
            catch (error) {
                const { response } = error;
                assert_1.default.equal(response.status, 404);
                assert_1.default.ok(response.data.indexOf('<html>') !== -1);
            }
        });
        it('shows a 404 JSON error without stack trace', async () => {
            try {
                await axios_1.default.get(getUrl('path/to/nowhere'));
                assert_1.default.fail('should never get here');
            }
            catch (error) {
                const { response } = error;
                assert_1.default.equal(response.status, 404);
                assert_1.default.equal(response.data.code, 404);
                assert_1.default.equal(response.data.message, 'Page not found');
                assert_1.default.equal(response.data.name, 'NotFound');
            }
        });
    });
});
