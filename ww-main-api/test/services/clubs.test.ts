import assert from 'assert';
import app from '../../src/app';

describe('\'clubs\' service', () => {
  it('registered the service', () => {
    const service = app.service('clubs');

    assert.ok(service, 'Registered the service');
  });
});
