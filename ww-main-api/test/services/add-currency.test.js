"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const app_1 = __importDefault(require("../../src/app"));
const add_currency_payload_type_1 = require("../../src/types/add.currency.payload.type");
describe('\'addCurrency\' service', () => {
    it('registered the service', () => {
        const service = app_1.default.service('wallets/add-currency');
        assert_1.default.ok(service, 'Registered the service');
    });
    it('Update the value of a wallet', async () => {
        const givenUser = {
            email: 'addcurrency@testing.com',
            password: '1234567890'
        };
        const recievedUser = await app_1.default.services.users.create(givenUser);
        const userWallet = await app_1.default.services.wallets.find({ query: { userId: recievedUser === null || recievedUser === void 0 ? void 0 : recievedUser.id }, paginate: false });
        const wallet = userWallet[0];
        assert_1.default.ok(wallet, 'Wallet needs to have an id');
        assert_1.default.ok(wallet.soft_currency >= 10 && wallet.soft_currency <= 1000, 'Soft Currency must be within range [10-1000]');
        assert_1.default.ok(wallet.hard_currency >= 5 && wallet.hard_currency <= 100, 'Soft Currency must be within range [5-100]');
        // it should increment the value
        const updateSoftWalletPayload = {
            currency_type: add_currency_payload_type_1.AddCurrencyPayloadCurrencyTypeKeys.SOFT,
            method: add_currency_payload_type_1.AddCurrencyPayloadMethodKeys.ADD,
            userId: recievedUser === null || recievedUser === void 0 ? void 0 : recievedUser.id,
            value: 10
        };
        const updatedWallet = await app_1.default.services['wallets/add-currency'].create(updateSoftWalletPayload);
        assert_1.default.ok(updatedWallet.soft_currency == (wallet.soft_currency + 10), 'Soft Currency must be within range [5-100]');
    });
});
