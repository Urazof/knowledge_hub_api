import { PublicUser, User } from '../models/user.model';

export function sanitizeUser(user: User): PublicUser {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

