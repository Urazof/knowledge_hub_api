import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Comment } from '../common/models/comment.model';
import { InMemoryDbService } from '../storage/in-memory-db.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly db: InMemoryDbService) {}

  findAll(): Comment[] {
    return this.db.comments;
  }

  findByArticleId(articleId: string): Comment[] {
    return this.db.comments.filter((comment) => comment.articleId === articleId);
  }

  create(payload: CreateCommentDto): Comment {
    const articleExists = this.db.articles.some((article) => article.id === payload.articleId);
    if (!articleExists) {
      throw new UnprocessableEntityException('articleId does not exist');
    }

    const comment: Comment = {
      id: randomUUID(),
      content: payload.content,
      articleId: payload.articleId,
      authorId: payload.authorId ?? null,
      createdAt: Date.now(),
    };

    this.db.comments.push(comment);
    return comment;
  }

  remove(id: string): void {
    const index = this.db.comments.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundException('Comment not found');
    }

    this.db.comments.splice(index, 1);
  }

}
