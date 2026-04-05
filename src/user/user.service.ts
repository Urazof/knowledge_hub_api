import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UserRole } from '../common/enums/user-role.enum';
import { PublicUser, User } from '../common/models/user.model';
import { sanitizeUser } from '../common/utils/sanitize-user';
import { InMemoryDbService } from '../storage/in-memory-db.service';

interface CreateUserPayload {
  login?: unknown;
  password?: unknown;
  role?: unknown;
}

interface UpdatePasswordPayload {
  oldPassword?: unknown;
  newPassword?: unknown;
}

@Injectable()
export class UserService {
  constructor(private readonly db: InMemoryDbService) {}

  findAllPublic(): PublicUser[] {
    return this.db.users.map(sanitizeUser);
  }

  findOnePublic(id: string): PublicUser {
    return sanitizeUser(this.findOneOrThrow(id));
  }

  create(payload: CreateUserPayload): PublicUser {
    if (typeof payload.login !== 'string' || payload.login.length === 0) {
      throw new BadRequestException('login is required');
    }

    if (typeof payload.password !== 'string' || payload.password.length === 0) {
      throw new BadRequestException('password is required');
    }

    const role = this.resolveRole(payload.role);
    const now = Date.now();

    const user: User = {
      id: randomUUID(),
      login: payload.login,
      password: payload.password,
      role,
      createdAt: now,
      updatedAt: now,
    };

    this.db.users.push(user);
    return sanitizeUser(user);
  }

  updatePassword(id: string, payload: UpdatePasswordPayload): PublicUser {
    if (typeof payload.oldPassword !== 'string' || payload.oldPassword.length === 0) {
      throw new BadRequestException('oldPassword is required');
    }

    if (typeof payload.newPassword !== 'string' || payload.newPassword.length === 0) {
      throw new BadRequestException('newPassword is required');
    }

    const user = this.findOneOrThrow(id);

    if (user.password !== payload.oldPassword) {
      throw new ForbiddenException('oldPassword is wrong');
    }

    user.password = payload.newPassword;
    user.updatedAt = Date.now();

    return sanitizeUser(user);
  }

  remove(id: string): void {
    const user = this.findOneOrThrow(id);
    const index = this.db.users.findIndex((item) => item.id === user.id);
    this.db.users.splice(index, 1);

    this.db.articles.forEach((article) => {
      if (article.authorId === user.id) {
        article.authorId = null;
      }
    });

    const commentsToKeep = this.db.comments.filter((comment) => comment.authorId !== user.id);
    this.db.comments.splice(0, this.db.comments.length, ...commentsToKeep);
  }

  private resolveRole(input: unknown): UserRole {
    if (input === undefined) {
      return UserRole.VIEWER;
    }

    if (input === UserRole.ADMIN || input === UserRole.EDITOR || input === UserRole.VIEWER) {
      return input;
    }

    throw new BadRequestException('role is invalid');
  }

  private findOneOrThrow(id: string): User {
    const user = this.db.users.find((item) => item.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
