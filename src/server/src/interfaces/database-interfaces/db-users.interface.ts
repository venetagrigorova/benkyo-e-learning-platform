/* eslint-disable camelcase */
import {UserRoles} from '../../common/user-roles.enum';

export interface UserInfoDBSafeRAW {
  user_id: number,
  email: string,
  first_name: string,
  last_name: string,
  birthdate: Date,
  registration_date: Date,
  role: UserRoles
}



export interface UserInfoDBPasswordRAW extends UserInfoDBSafeRAW {
  password: string
}
