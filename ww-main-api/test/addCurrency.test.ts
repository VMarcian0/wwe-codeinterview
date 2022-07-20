import assert from 'assert';
import app from '../../src/app';
import { UserType } from '../../src/types/user.type';
import { WalletType } from '../../src/types/wallet.type';
import { AddCurrencyPayload, AddCurrencyPayloadCurrencyTypeKeys, AddCurrencyPayloadMethodKeys } from '../src/types/add.currency.payload.type';

describe('addCurrency usage', () => {
  it('created and store a user', async () => {
    const givenUser : UserType = {
      email:'addcurrency@testing.com',
      password:'1234567890'
    };

    const recievedUser = await app.services.users.create(givenUser) as UserType;

    const userWallet = await app.services.wallets.find({query:{userId:recievedUser?.id as number},paginate:false}) as WalletType[];
  
    const wallet = userWallet[0];
    assert.ok(wallet, 'Wallet needs to have an id');
    assert.ok(wallet.soft_currency >= 10 && wallet.soft_currency <= 1000, 'Soft Currency must be within range [10-1000]');
    assert.ok(wallet.hard_currency >= 5 && wallet.hard_currency <= 100, 'Soft Currency must be within range [5-100]');

    // it should increment the value
    const updateSoftWalletPayload : AddCurrencyPayload = {
      currency_type: AddCurrencyPayloadCurrencyTypeKeys.SOFT,
      method: AddCurrencyPayloadMethodKeys.ADD,
      userId: recievedUser?.id as number,
      value: 10
    }

    let updatedWallet = await app.services['wallets/add-currency'].create()
  });
});