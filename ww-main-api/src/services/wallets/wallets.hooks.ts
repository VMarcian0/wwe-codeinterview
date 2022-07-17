import { HookContext } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import { getUserFromToken } from '../../hooks/getUserFromToken.hook';
import { Unprocessable } from '@feathersjs/errors';
import app from '../../app';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
/**
 * Fill the userId field in other to make the correct association
 * @param context 
 * @returns 
 */
const associateUser = async (context:HookContext) => {
  /**
   * This if in here checks if it is an internal call from within the application
   */
  if(!context?.params?.provider){
    return context;
  }
  else{
    /**
     * If it is an external call i retrieve the user information on the token
     */
    const user = await getUserFromToken(context);
    
    context.data = {
      userId: user?.id as number
    };
    
    return context;
  }
};

const ensureOnlyOneWalletForUser = async (context:HookContext) => {
  if(!context?.data?.userId){
    throw new Unprocessable('Missing userId');
  }
  
  const userId = context?.data?.userId;
  
  const walletsFound = await app.services.wallets._find({query:{userId},paginate:false}) as any[];
  if(walletsFound.length > 0){
    throw new Unprocessable('User Already has a wallet');
  }
  
  return context;
};

const generateRandomIntWitihinInterval = (min:number,max:number):number =>{
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor((Math.random() * (max - min)) + min);
};

const initializeValues = async (context:HookContext) => {
  context.data.hard_currency = generateRandomIntWitihinInterval(5, 100);
  context.data.soft_currency = generateRandomIntWitihinInterval(10, 1000);
  return context;
};


export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [associateUser, ensureOnlyOneWalletForUser, initializeValues],
    update: [],
    patch: [],
    remove: []
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
