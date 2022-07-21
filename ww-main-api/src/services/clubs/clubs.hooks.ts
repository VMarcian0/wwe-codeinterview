import * as authentication from '@feathersjs/authentication';
import { HookContext } from '@feathersjs/feathers';
import { Sequelize } from 'sequelize';
import app from '../../app';
import { getUserFromToken } from '../../hooks/getUserFromToken.hook';
import usersModel from '../../models/users.model';
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
  }
  return context;
}

const canCreate = async (context:HookContext) => {
  
}


const updateUserRelation = async (context:HookContext) => {
  if(!context?.result) return context;

  const currentUserId = (await getUserFromToken(context)).id as number;
  await app.services.users._patch(currentUserId,{'clubId':context.result.id})
}

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [associate],
    get: [associate],
    create: [],
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
