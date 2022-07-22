import * as authentication from '@feathersjs/authentication';
import { Unprocessable } from '@feathersjs/errors';
import { HookContext, Paginated } from '@feathersjs/feathers';
import { Sequelize } from 'sequelize';
import app from '../../app';
import { MakeTransaction } from '../../hooks/genericTransaction.hook';
import { getUserFromToken } from '../../hooks/getUserFromToken.hook';
import { AddCurrencyPayloadMethodKeys } from '../../types/add.currency.payload.type';
import { ClubPostPayladType, ClubPostPayladTypeMethodKeys } from '../../types/club.payload.type';
import { UserType } from '../../types/user.type';
import { verifyEnum } from '../../util/verifyEnum.util';
import { disallow } from 'feathers-hooks-common';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

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
      throw new Unprocessable('Missing clubId to join',{required:'clubId field'});
    }
    context = await canJoin(context);
    break;
  default:
    throw new Unprocessable('Methos out of bounds',{method:payload.method});
    break;
  }
  return context;
};

const canCreate = async (context:HookContext) => {
  //Get user making the request
  const currentUserId = (await getUserFromToken(context, {'$select':['_id']})).id as number;
  //Make him pay the price of creating a club
  //TODO : clubDefaultPrices should have a type
  const defaultPrice = app.get('clubDefaultPrices');
  await MakeTransaction(defaultPrice.create.currency, AddCurrencyPayloadMethodKeys.REMOVE, currentUserId, defaultPrice.create.value);
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
  const clubId = context.data.clubId as number;
  //* Validate if the user isn´t already on the club
  const currentUser = (await getUserFromToken(context)) as UserType;
  if(currentUser.clubId == clubId) {
    throw new Unprocessable('User already on this club');
  }

  //* validate if the club has reached its maximum capacity
  if((await countUsersOnAClub(clubId)) == app.get('clubMaximumCapacity')){
    throw new Unprocessable('This club has reached its maximum capacity');
  }

  //* make the payment
  //TODO : clubDefaultPrices should have a type
  const defaultPrice = app.get('clubDefaultPrices');
  await MakeTransaction(defaultPrice.join.currency, AddCurrencyPayloadMethodKeys.REMOVE, currentUser?.id as number, defaultPrice.join.value);
  
  //* fill the result with the givenclubId and the updateRelationHook should work
  const club = await app.services.clubs._get(clubId);
  context.result = {...club};
  context.statusCode = 201;

  delete context?.data;

  return context;
};


const countUsersOnAClub = async (clubId:number) : Promise<number> => {
  const query = {
    clubId,
    $select:['id'],
    $limit: 0
  };
  return (await app.services.users._find({query}) as Paginated<UserType>).total;
};



const updateUserRelation = async (context:HookContext) => {
  if(!context?.result) return context;

  const currentUserId = (await getUserFromToken(context, {'$select':['_id']})).id as number;
  await app.services.users._patch(currentUserId,{'clubId':context.result.id});
};

const filter = async (context:HookContext) =>{
  const user = await getUserFromToken(context);

  if(!user?.clubId){
    throw new Unprocessable('You need to join  club in order to see it');
  }

  if (context?.id != user.clubId){
    context.id = user.clubId;
  }
  context.id = user.clubId;
  return;
};

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [associate,filter],
    get: [associate,filter],
    create: [switchMethods],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
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
