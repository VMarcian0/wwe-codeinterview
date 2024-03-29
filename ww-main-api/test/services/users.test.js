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
    });
    it('creates a wallet after creating a user', async () => {
        const givenUser = {
            email: 'wallet@testing.com',
            password: '1234567890'
        };
        const recievedUser = await app_1.default.services.users.create(givenUser);
        assert_1.default.ok(recievedUser === null || recievedUser === void 0 ? void 0 : recievedUser.id, 'User has an id');
        assert_1.default.equal(recievedUser.email, givenUser.email, 'User email is kept');
        const userWallet = await app_1.default.services.wallets.find({ query: { userId: recievedUser === null || recievedUser === void 0 ? void 0 : recievedUser.id }, paginate: false });
        assert_1.default.equal(userWallet.length, 1, 'Only one wallet by user');
        const wallet = userWallet[0];
        assert_1.default.ok(wallet, 'Wallet needs to have an id');
        assert_1.default.ok(wallet.soft_currency >= 10 && wallet.soft_currency <= 1000, 'Soft Currency must be within range [10-1000]');
        assert_1.default.ok(wallet.hard_currency >= 5 && wallet.hard_currency <= 100, 'Soft Currency must be within range [5-100]');
    });
});
