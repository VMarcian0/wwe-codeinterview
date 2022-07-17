"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const app_1 = __importDefault(require("../src/app"));
describe('authentication', () => {
    it('registered the authentication service', () => {
        assert_1.default.ok(app_1.default.service('authentication'));
    });
    describe('local strategy', () => {
        const userInfo = {
            email: 'someone@example.com',
            password: 'supersecret'
        };
        before(async () => {
            try {
                await app_1.default.service('users').create(userInfo);
            }
            catch (error) {
                // Do nothing, it just means the user already exists and can be tested
            }
        });
        it('authenticates user and creates accessToken', async () => {
            const { user, accessToken } = await app_1.default.service('authentication').create({
                strategy: 'local',
                ...userInfo
            }, {});
            assert_1.default.ok(accessToken, 'Created access token for user');
            assert_1.default.ok(user, 'Includes user in authentication data');
        });
    });
});
