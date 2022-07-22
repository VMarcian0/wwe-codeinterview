import assert from 'assert';
import app from '../src/app';

describe('authentication', () => {
  it('registered the authentication service', () => {
    assert.ok(app.service('authentication'));
  });
  
  describe('local strategy', () => {
    const userInfo = {
      email: 'someone@example.com',
      password: 'supersecret'
    };
    
    it('authenticates user and creates accessToken', async () => {
      try {
        const result = await app.service('users').create(userInfo);
        assert.ok(result?.id, 'It created the user');
      } catch (error) {
        // Do nothing, it just means the user already exists and can be tested
      }
      const { user, accessToken } = await app.service('authentication').create({
        strategy: 'local',
        ...userInfo
      }, {});
      
      assert.ok(accessToken, 'Created access token for user');
      assert.ok(user, 'Includes user in authentication data');
    });
  });
});
