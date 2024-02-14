import {UserRoles} from '../common/user-roles.enum';

export interface TokenPayloadInterface {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoles;
}

export type Token = string;
