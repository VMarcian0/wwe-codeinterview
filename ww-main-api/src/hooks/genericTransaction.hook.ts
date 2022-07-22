import app from '../app';
import { AddCurrencyPayload, AddCurrencyPayloadCurrencyTypeKeys, AddCurrencyPayloadMethodKeys } from '../types/add.currency.payload.type';
import { WalletType } from '../types/wallet.type';
/**
 * Makes the desired transaction
 * @param currency 
 * @param method 
 * @param userId 
 * @param value 
 */
export const MakeTransaction = async (currency_type:AddCurrencyPayloadCurrencyTypeKeys, method:AddCurrencyPayloadMethodKeys, userId:number, value:number) => {
  const payload : AddCurrencyPayload = {
    userId,
    currency_type,
    method,
    value
  };
  return await app.services['wallets/add-currency'].create(payload) as WalletType;
}; 