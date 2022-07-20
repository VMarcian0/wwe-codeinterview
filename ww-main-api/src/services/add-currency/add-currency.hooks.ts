import { HookContext, HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import { getUserFromToken } from '../../hooks/getUserFromToken.hook';
import { Forbidden, Unprocessable } from '@feathersjs/errors';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
import { disallow } from 'feathers-hooks-common';

const verifyAllowedUser = async (context:HookContext) => {
  const user = await getUserFromToken(context);
  /**
   * I'am assuming that the sysadmin would be the user with the id = 1
   * There are beter ways of doing this with a api-key authentication for instance
   * or implementing roles on the users, but for simplicity I'll leave this way
   */
  if(user?.id != 1) {
    throw new Forbidden("Only the sysadmin can use this route")
  }

  return context;
}



const addCurrency = async (context:HookContext) => {
  
  if(!context?.data) {
    return context
  }
  
  const payload : AddCurrencyPayload = verifyPayload(context.data as AddCurrencyPayload);

  interface AddCurrencyPayload {
    method: method_keys,
    currency_type: currency_type_keys,
    value: number,
    user_id: number,
    wallet_id: number
  }

  enum method_keys{
    ADD = 'add',
    REMOVE = 'remove'
  }

  enum currency_type_keys{
    SOFT = 'soft',
    HARD = 'hard'
  }

  function verifyPayload(payload:AddCurrencyPayload) {
    if (!payload?.currency_type) {
      throw new Unprocessable("Missing currency_type field");
    }

    verifyEnum(currency_type_keys, 'currency_type', payload.method)

    if (!payload?.method) {
      throw new Unprocessable("Missing method field");
    }

    verifyEnum(method_keys, 'method', payload.method)

    if (!payload?.user_id) {
      throw new Unprocessable("Missing user_id field");
    }

    if (!payload?.wallet_id) {
      throw new Unprocessable("Missing wallet_id field");
    }

    if (!payload?.value) {
      throw new Unprocessable("Missing value field");
    }
    if (payload.value == 0){
      throw new Unprocessable("Invalid Value");
    }
    payload.value = Math.floor(Math.abs(payload.value));
    return payload;
  }
  
  const verifyEnum = ( enumerator : any, field_name:string, value:any): boolean => {
    if (!Object.values(enumerator).includes(value)) {
      throw new Unprocessable(
        `${field_name} not expected`,
        {
          expected: Object.values(enumerator)
        }
      )
    }
    return true
  }
}


export default {
  before: {
    all: [ authenticate('jwt'), verifyAllowedUser ],
    find: [disallow()],
    get: [disallow()],
    create: [],
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
