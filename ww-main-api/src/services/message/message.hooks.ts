import { HookContext } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import { Sequelize } from 'sequelize';
import app from '../../app';
import { getUserFromToken } from '../../hooks/getUserFromToken.hook';
import { BadRequest } from '@feathersjs/errors';
import { UserType } from '../../types/user.type';
import { disallow } from 'feathers-hooks-common';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const associate = async (context:HookContext) => {
  const sequelizeClient = app.get('sequelizeClient') as Sequelize;
  const { users, clubs } = sequelizeClient.models;
  context.params.sequelize = {
    include: [{model:users}, {model:clubs}],
    raw:false
  };
  return context;
};
/**
 * Hook to filter the messages that belongs only to the club that he has already joined
 * @param context 
 */
const filterClubsAndAssociateIds = async(context:HookContext) => {
  const user = await getUserFromToken(context, {'$select':['clubId']}) as Partial<UserType>;
  if (!user?.clubId) {
    throw new BadRequest('You need to join a club in order to see its messages');
  }
  context.params.query = {
    ...context.params?.query,
    clubId: user.clubId
  };

  if (!context?.data){
    return context;
  }

  context.data = {
    ...context.data,
    userId: user?.id as number,
    clubId: user.clubId
  };
  return context;
};

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [associate, filterClubsAndAssociateIds],
    get: [associate, filterClubsAndAssociateIds], 
    create: [filterClubsAndAssociateIds],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
