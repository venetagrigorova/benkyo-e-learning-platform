import {UserRoles} from '../common/user-roles.enum';

export type UserCredentials = {
  email: string,
  password: string
};

export interface NewUserNoRole extends UserCredentials {
  firstName: string,
  lastName: string,
  birthdate: string
}

export interface NewUserWithRole extends NewUserNoRole {
  role: UserRoles
}


export interface UserInfoNoRole extends NewUserNoRole, UserCredentials {
  registrationDate: Date;
}

export interface UserInfoWithRole extends NewUserWithRole, UserCredentials { }

export interface UserInfoDBSafe {
  userId: number,
  email: string,
  firstName: string,
  lastName: string,
  birthdate: Date,
  registrationDate: Date,
  role: UserRoles
}

export interface EditUserInfo {
  userId: number,
  email: string,
  firstName: string,
  lastName: string,
  birthdate: Date,
  role: UserRoles
}

export interface UserInfoDBPassword extends UserInfoDBSafe {
  password: string
}
