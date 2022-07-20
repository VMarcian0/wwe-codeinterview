// Initializes the `addCurrency` service on path `/wallets/add-currency`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { AddCurrency } from './add-currency.class';
import hooks from './add-currency.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'wallets/add-currency': AddCurrency & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/wallets/add-currency', new AddCurrency(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('wallets/add-currency');

  service.hooks(hooks);
}
