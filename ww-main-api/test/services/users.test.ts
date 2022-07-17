import assert from 'assert';
import app from '../../src/app';
import { UserType } from '../../src/types/user.type';
import { WalletType } from '../../src/types/wallet.type';

describe('\'users\' service', () => {
  it('registered the service', () => {
    const service = app.service('users');

    assert.ok(service, 'Registered the service');
  });
  it('created and store a user', async () => {
    const givenUser : UserType = {
      email:'testing@testing.com',
      password:'1234567890'
    };

    const recievedUser = await app.services.users.create(givenUser) as UserType;

    assert.ok(recievedUser?.id, 'User has an id');
    assert.equal(recievedUser.email, givenUser.email, 'User email is kept');
  });
  it('creates a wallet after creating a user', async() => {
    const givenUser : UserType = {
      email:'wallet@testing.com',
      password:'1234567890'
    };

    const recievedUser = await app.services.users.create(givenUser) as UserType;

    assert.ok(recievedUser?.id, 'User has an id');
    assert.equal(recievedUser.email, givenUser.email, 'User email is kept');

    const userWallet = await app.services.wallets.find({query:{userId:recievedUser?.id as number},paginate:false}) as WalletType[];


    assert.equal(userWallet.length, 1, 'Only one wallet by user');

    const wallet = userWallet[0];
    assert.ok(wallet, 'Wallet needs to have an id');
    assert.ok(wallet.soft_currency >= 10 && wallet.soft_currency <= 1000, 'Soft Currency must be within range [10-1000]');
    assert.ok(wallet.hard_currency >= 5 && wallet.hard_currency <= 100, 'Soft Currency must be within range [5-100]');
  });
});