"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const app_1 = __importDefault(require("../../src/app"));
const add_currency_payload_type_1 = require("../../src/types/add.currency.payload.type");
const club_payload_type_1 = require("../../src/types/club.payload.type");
describe('\'message\' service', () => {
    it('registered the service', () => {
        const service = app_1.default.service('message');
        assert_1.default.ok(service, 'Registered the service');
    });
    it('sends a message to a club', async () => {
        const givenUser = {
            email: 'message@testing.com',
            password: '1234567890'
        };
        //creates the user
        const recievedUser = await app_1.default.services.users.create(givenUser);
        //give enought hard currency to create a club
        const updateSoftWalletPayload = {
            currency_type: add_currency_payload_type_1.AddCurrencyPayloadCurrencyTypeKeys.HARD,
            method: add_currency_payload_type_1.AddCurrencyPayloadMethodKeys.ADD,
            userId: recievedUser === null || recievedUser === void 0 ? void 0 : recievedUser.id,
            value: 50
        };
        await app_1.default.services['wallets/add-currency'].create(updateSoftWalletPayload);
        //authenticate
        const { accessToken } = await app_1.default.service('authentication').create({
            strategy: 'local',
            ...givenUser
        }, {});
        //create a club
        const clubCreationPayload = {
            method: club_payload_type_1.ClubPostPayladTypeMethodKeys.CREATE,
            name: 'Testing Message'
        };
        const clubCreationResponse = await app_1.default.services.clubs.create(clubCreationPayload, { authentication: accessToken });
        assert_1.default.ok(clubCreationResponse === null || clubCreationResponse === void 0 ? void 0 : clubCreationResponse.id, 'Club creation sucessfull');
        const messagePayload = {
            message: 'Hello World!\nThis is a testing message'
        };
        const messageCreationPayload = await app_1.default.services.message.create(messagePayload, { authentication: accessToken });
        assert_1.default.ok(messageCreationPayload.id, 'Message sent');
    });
});
