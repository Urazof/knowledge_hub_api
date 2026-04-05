import { Injectable } from '@nestjs/common';
import { PublicUser } from '../common/models/user.model';
import { sanitizeUser } from '../common/utils/sanitize-user';
import { InMemoryDbService } from '../storage/in-memory-db.service';

@Injectable()
export class UserService {
  constructor(private readonly db: InMemoryDbService) {}

  findAllPublic(): PublicUser[] {
    return this.db.users.map(sanitizeUser);
  }
}

