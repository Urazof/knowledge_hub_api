import { Injectable } from '@nestjs/common';
import { Comment } from '../common/models/comment.model';
import { InMemoryDbService } from '../storage/in-memory-db.service';

@Injectable()
export class CommentService {
  constructor(private readonly db: InMemoryDbService) {}

  findAll(): Comment[] {
    return this.db.comments;
  }
}

