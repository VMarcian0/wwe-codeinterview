// Initializes the `clubs` service on path `/clubs`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Clubs } from './clubs.class';
import createModel from '../../models/clubs.model';
import hooks from './clubs.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'clubs': Clubs & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/clubs', new Clubs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('clubs');

  service.hooks(hooks);
}
