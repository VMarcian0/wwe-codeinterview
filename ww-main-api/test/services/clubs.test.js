"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const app_1 = __importDefault(require("../../src/app"));
describe('\'clubs\' service', () => {
    it('registered the service', () => {
        const service = app_1.default.service('clubs');
        assert_1.default.ok(service, 'Registered the service');
    });
});
