import * as authentication from '@feathersjs/authentication';
import { Unprocessable } from '@feathersjs/errors';
import { HookContext, Paginated } from '@feathersjs/feathers';
import { Sequelize } from 'sequelize';
import app from '../../app';
import { MakeTransaction } from '../../hooks/genericTransaction.hook';
import { getUserFromToken } from '../../hooks/getUserFromToken.hook';
import { AddCurrencyPayload, AddCurrencyPayloadCurrencyTypeKeys, AddCurrencyPayloadMethodKeys } from '../../types/add.currency.payload.type';
import { ClubPostPayladType, ClubPostPayladTypeMethodKeys } from '../../types/club.payload.type';
import { UserType } from '../../types/user.type';
import { verifyEnum } from '../../util/verifyEnum.util';
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

const switchMethods = async (context:HookContext) => {
  /**
   * @TODO
   * validate the method keys
   * according the method validate the payload
   * switch between methods
   */
  if (!context?.data) {return context;}
  const payload = context.data as ClubPostPayladType;

  verifyEnum(ClubPostPayladTypeMethodKeys,'method',payload.method);

  switch (payload.method) {
    case ClubPostPayladTypeMethodKeys.CREATE:
      context = await canCreate(context);
      break;
    case ClubPostPayladTypeMethodKeys.JOIN:
      if (!payload.clubId) {
        throw new Unprocessable("Missing clubId to join",{required:'clubId field'})
      }
      context = await canJoin(context);
      break;
    default:
      throw new Unprocessable('Methos out of bounds',{method:payload.method});
      break;
  }
  return context
}

const canCreate = async (context:HookContext) => {
  //Get user making the request
  const currentUserId = (await getUserFromToken(context, {'$select':['_id']})).id as number;
  //Make him pay the price of creating a club
  //TODO : clubDefaultPrices should have a type
  const defaultPrice = app.get('clubDefaultPrices')
  await MakeTransaction(defaultPrice.create.currency, AddCurrencyPayloadMethodKeys.REMOVE, currentUserId, defaultPrice.create.value)
  return context;
};


const canJoin = async (context:HookContext) => {
  /**
   * @todo A better concurrncy solution
   * @description
   * The correct way to handle the joining of users in a club would be to
   * queue all the joinings to a club (possibily on a second layer of memory)
   * and resolve one request at time on a separeted service i comonlly call "watchers"
   */
  //* validate if the club has reached its maximum capacity
  const clubId = context.data.clubId as number;
  if((await countUsersOnAClub(clubId)) == app.get('clubMaximumCapacity')){
    throw new Unprocessable("This club has reached its maximum capacity")
  }

  //* make the payment
  const currentUserId = (await getUserFromToken(context, {'$select':['_id']})).id as number;
  //TODO : clubDefaultPrices should have a type
  const defaultPrice = app.get('clubDefaultPrices')
  await MakeTransaction(defaultPrice.join.currency, AddCurrencyPayloadMethodKeys.REMOVE, currentUserId, defaultPrice.join.value)
  
  //* fill the result with the givenclubId and the updateRelationHook should work
  const club = await app.services.clubs._get(clubId);
  context.result = {...club};
  context.statusCode = 201;

  delete context?.data;

  return context;
}


const countUsersOnAClub = async (clubId:number) : Promise<number> => {
  const query = {
    clubId,
    $select:['id'],
    $limit: 0
  }
  return (await app.services.users._find({query}) as Paginated<UserType>).total;
}



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
    create: [switchMethods],
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
