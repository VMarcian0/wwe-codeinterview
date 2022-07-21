import * as authentication from '@feathersjs/authentication';
import { Unprocessable } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import { Sequelize } from 'sequelize';
import app from '../../app';
import { MakeTransaction } from '../../hooks/genericTransaction.hook';
import { getUserFromToken } from '../../hooks/getUserFromToken.hook';
import { AddCurrencyPayload, AddCurrencyPayloadCurrencyTypeKeys, AddCurrencyPayloadMethodKeys } from '../../types/add.currency.payload.type';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

/* interface ClubPostPayload{
  method: ClubPostPayloadMethodKeys,
  //JOIN
  clubId?: number,
  //Create
  name?: string
}

enum ClubPostPayloadMethodKeys{
  CREATE = 'create',
  JOIN = 'join'
} */

const associate = async (context:HookContext) => {
  const sequelizeClient = app.get('sequelizeClient') as Sequelize;
  const { users } = sequelizeClient.models;
  context.params.sequelize = {
    include: [{model:users}],
    raw:false
  };
  return context;
};

const canCreate = async (context:HookContext) => {
  //Get user making the request
  const currentUserId = (await getUserFromToken(context, {'$select':['_id']})).id as number;
  //Make him pay the price of creating a club
  //TODO : clubDefaultPrices should have a type
  const defaultPrice = app.get('clubDefaultPrices')
  await MakeTransaction(defaultPrice.create.currency, AddCurrencyPayloadMethodKeys.REMOVE, currentUserId, defaultPrice.create.value)
  return context;
};


const updateUserRelation = async (context:HookContext) => {
  if(!context?.result) return context;

  const currentUserId = (await getUserFromToken(context, {'$select':['_id']})).id as number;
  await app.services.users._patch(currentUserId,{'clubId':context.result.id});
};

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [associate],
    get: [associate],
    create: [canCreate],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [updateUserRelation],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
