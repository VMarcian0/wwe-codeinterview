import assert from 'assert';
import app from '../../src/app';

describe('\'wallets\' service', () => {
  it('registered the service', () => {
    const service = app.service('wallets');

    assert.ok(service, 'Registered the service');
  });
});
