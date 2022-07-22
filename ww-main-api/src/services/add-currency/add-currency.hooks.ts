import { HookContext } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import { getUserFromToken } from '../../hooks/getUserFromToken.hook';
import { Forbidden, NotFound, Unprocessable } from '@feathersjs/errors';
const { authenticate } = authentication.hooks;
import { disallow } from 'feathers-hooks-common';
import { verifyEnum } from '../../util/verifyEnum.util';
import app from '../../app';
import { WalletType } from '../../types/wallet.type';
import { AddCurrencyPayload, AddCurrencyPayloadCurrencyTypeKeys, AddCurrencyPayloadMethodKeys } from '../../types/add.currency.payload.type';
// Don't remove this comment. It's needed to format import lines nicely.


const verifyAllowedUser = async (context:HookContext) => {
  /**
   * Verify if it is an internal system call
   */
  if(!context?.params?.provider) {return context;}

  const user = await getUserFromToken(context);
  /**
   * I am assuming that the sysadmin would be the user with the id = 1
   * There are better ways of doing this with a api-key authentication for instance
   * or implementing roles on the users, but for simplicity sake I'll leave this way
   */
  if(user?.id != 1) {
    throw new Forbidden('Only the sysadmin can use this route');
  }

  return context;
};



const addCurrency = async (context:HookContext) => {
  
  if(!context?.data) {
    return context;
  }
  
  const payload = verifyPayloadFieldsAndNormalizeValue(context.data as AddCurrencyPayload);

  const wallet = await verifyUserIdAndRetrieveWallet(payload);
  
  if (!validateValue(payload, wallet)){
    throw new Unprocessable('Wallet has insufficient funds',{wallet:wallet, cost:{currency:payload.currency_type, value:payload.value}});
  }

  const result = await patchWallet(wallet,payload);

  context.result = result;

  context.statusCode = 200;

  return context;
  
  function verifyPayloadFieldsAndNormalizeValue(payload:AddCurrencyPayload) {
    if (!payload?.currency_type) {
      throw new Unprocessable('Missing currency_type field');
    }
    
    verifyEnum(AddCurrencyPayloadCurrencyTypeKeys, 'currency_type', payload.currency_type);
    
    if (!payload?.method) {
      throw new Unprocessable('Missing method field');
    }

    verifyEnum(AddCurrencyPayloadMethodKeys, 'method', payload.method);

    if (!payload?.userId) {
      throw new Unprocessable('Missing userId field');
    }
    
    if (!payload?.value) {
      throw new Unprocessable('Missing value field');
    }
    if (payload.value == 0){
      throw new Unprocessable('Invalid Value');
    }
    payload.value = Math.floor(Math.abs(payload.value));
    return payload;
  }
  
  async function  verifyUserIdAndRetrieveWallet (payload:AddCurrencyPayload) {
    await app.services.users.get(payload.userId,{query:{$select:['id']}});
    
    const walletsFound = await app.services.wallets._find({query:{userId:payload.userId, $limit:1}, paginate:false}) as WalletType[];
    if(walletsFound.length == 0 ){
      throw new NotFound('Wallet for given user not found',{userId:payload.userId});
    }
    return walletsFound[0];
  }

  function validateValue(payload:AddCurrencyPayload, wallet:WalletType){
    if(payload.method == AddCurrencyPayloadMethodKeys.REMOVE){
      if (payload.currency_type == AddCurrencyPayloadCurrencyTypeKeys.HARD){
        if (wallet.hard_currency - payload.value < 0){
          return false;
        }
      }
      if (payload.currency_type == AddCurrencyPayloadCurrencyTypeKeys.SOFT){
        if (wallet.soft_currency - payload.value < 0){
          return false;
        }
      }
    }
    return true;
  }

  async function  patchWallet(wallet: WalletType, payload: AddCurrencyPayload) {
    if(!wallet?.id) {
      //this is not reachable
      throw new Unprocessable();
    }
    const updatedValue = buildUpdatedValue(wallet,payload);
    return await app.services.wallets._patch(wallet.id, updatedValue) as WalletType;
  }

  function buildUpdatedValue(wallet: WalletType, payload: AddCurrencyPayload): Partial<WalletType>{
    if (payload.method == AddCurrencyPayloadMethodKeys.ADD){
      if(payload.currency_type == AddCurrencyPayloadCurrencyTypeKeys.HARD){
        return {hard_currency: wallet.hard_currency + payload.value};
      }
      if(payload.currency_type == AddCurrencyPayloadCurrencyTypeKeys.SOFT){
        return {soft_currency: wallet.soft_currency + payload.value};
      }
    }
    if (payload.method == AddCurrencyPayloadMethodKeys.REMOVE){
      if(payload.currency_type == AddCurrencyPayloadCurrencyTypeKeys.HARD){
        return {hard_currency: +(wallet.hard_currency - payload.value).toFixed(0)};
      }
      if(payload.currency_type == AddCurrencyPayloadCurrencyTypeKeys.SOFT){
        return {soft_currency: +(wallet.soft_currency - payload.value).toFixed(0)};
      }
    }
    return {};
  }
};


export default {
  before: {
    all: [ authenticate('jwt'), verifyAllowedUser ],
    find: [disallow()],
    get: [disallow()],
    create: [addCurrency],
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

