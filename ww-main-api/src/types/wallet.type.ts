import { BasicDocumentType } from './basic.document.type';

export interface WalletType extends BasicDocumentType{
    hard_currency:number,
    soft_currency:number,
    userId:string|number
}