import assert from 'assert';
import app from '../../src/app';
import { AddCurrencyPayload, AddCurrencyPayloadCurrencyTypeKeys, AddCurrencyPayloadMethodKeys } from '../../src/types/add.currency.payload.type';
import { ClubPostPayloadType, ClubPostPayloadTypeMethodKeys } from '../../src/types/club.payload.type';
import { UserType } from '../../src/types/user.type';
import { WalletType } from '../../src/types/wallet.type';


describe('\'message\' service', () => {
  it('registered the service', () => {
    const service = app.service('message');

    assert.ok(service, 'Registered the service');
  });
  it('it sends a message to a club', async () => {
    const givenUser = {
      email:'message@testing.com',
      password:'1234567890'
    };
    //creates the user
    const receivedUser = await app.services.users.create(givenUser) as UserType;
    
    //give enough hard currency to create a club
    const updateSoftWalletPayload : AddCurrencyPayload = {
      currency_type: AddCurrencyPayloadCurrencyTypeKeys.HARD,
      method: AddCurrencyPayloadMethodKeys.ADD,
      userId: receivedUser?.id as number,
      value: 50
    };
    await app.services['wallets/add-currency'].create(updateSoftWalletPayload) as WalletType;
  
    const {accessToken} = await authenticateUser(givenUser);
    assert.ok(accessToken, 'It authenticates');
    //create a club
    const clubCreationPayload : ClubPostPayloadType = {
      method: ClubPostPayloadTypeMethodKeys.CREATE,
      name: 'Testing Message'
    };
    const clubCreationResponse = await app.services.clubs.create(clubCreationPayload,{authentication: { strategy: 'jwt', accessToken: accessToken }});
    assert.ok(clubCreationResponse?.id, 'Club creation successful');

    const messagePayload = {
      message: 'Hello World!\nThis is a testing message'
    };
    const messageCreationPayload = await app.services.message.create(messagePayload,{authentication: { strategy: 'jwt', accessToken: accessToken }});
    assert.ok(messageCreationPayload.id, 'Message sent');

  });
});

async function authenticateUser (userInfo:any){
  //authenticate
  const authPayload = {
    strategy: 'local',
    ...userInfo
  };
  return await app.service('authentication').create(authPayload, {});
}