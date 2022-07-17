import { BasicDocumentType } from './basic.document.type';

export interface UserType extends BasicDocumentType{
    email:string,
    /**
     * Password is an optional field due the protect hook
     * witch will hide the plaintext password from the document
     */
    password?:string,
}