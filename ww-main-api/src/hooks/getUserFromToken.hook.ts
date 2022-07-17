import { NotAuthenticated } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import jwt from 'jsonwebtoken';
import app from '../app';
import { UserType } from '../types/user.type';
/**
 * Get the whole user from users collection using the auth token to do so.
 * @param context feathers context
 * @returns user as UserType
 * @throws NotAuthenticated
 * @async
 */
export const getUserFromToken = async ( context: HookContext ): Promise<UserType> => {
  
  const token: string = context?.params?.headers?.authorization || context?.params?.authentication?.accessToken;
  if ( !token ) throw new NotAuthenticated('No authorization token has been found', {
    sentHeaders: context?.params?.headers,
    missingHeader: { 'Authorization': '<token>'}
  });

  const decoded = jwt.decode( token );
  if ( !decoded ) throw new NotAuthenticated('Invalid JWT', {
    token
  });

  const userId: string = decoded?.sub as string;
  if ( !userId ) throw new NotAuthenticated('Could not found property sub', {
    decodedToken: decoded
  });

  const user: UserType = await app.services.users._get( userId );
  delete user?.password;

  return user;
};
