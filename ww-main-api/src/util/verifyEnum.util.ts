import { Unprocessable } from '@feathersjs/errors';

export const verifyEnum = ( enumerator : any, field_name:string, value:any): boolean => {
  if (!Object.values(enumerator).includes(value)) {
    throw new Unprocessable(
      `${field_name} not expected`,
      {
        expected: Object.values(enumerator)
      }
    );
  }
  return true;
};