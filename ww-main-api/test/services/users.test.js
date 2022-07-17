"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const app_1 = __importDefault(require("../../src/app"));
describe('\'users\' service', () => {
    it('registered the service', () => {
        const service = app_1.default.service('users');
        assert_1.default.ok(service, 'Registered the service');
    });
    it('created and store a user', async () => {
        const givenUser = {
            email: 'testing@testing.com',
            password: '1234567890'
        };
        const recievedUser = await app_1.default.services.users.create(givenUser);
        assert_1.default.ok(recievedUser === null || recievedUser === void 0 ? void 0 : recievedUser.id, 'User has an id');
        assert_1.default.equal(recievedUser.email, givenUser.email, 'User email is kept');
        assert_1.default.ok(!(recievedUser === null || recievedUser === void 0 ? void 0 : recievedUser.password), 'Password is not showing');
    });
});
