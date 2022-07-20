import assert from 'assert';
import app from '../../src/app';

describe('\'addCurrency\' service', () => {
  it('registered the service', () => {
    const service = app.service('wallets/add-currency');

    assert.ok(service, 'Registered the service');
  });
});
