import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Comment } from '../common/models/comment.model';
import { InMemoryDbService } from '../storage/in-memory-db.service';

interface CreateCommentPayload {
  content?: unknown;
  articleId?: unknown;
  authorId?: unknown;
}

@Injectable()
export class CommentService {
  constructor(private readonly db: InMemoryDbService) {}

  findAll(): Comment[] {
    return this.db.comments;
  }

  findByArticleId(articleId: string): Comment[] {
    return this.db.comments.filter((comment) => comment.articleId === articleId);
  }

  create(payload: CreateCommentPayload): Comment {
    if (typeof payload.content !== 'string' || payload.content.length === 0) {
      throw new BadRequestException('content is required');
    }

    if (typeof payload.articleId !== 'string' || payload.articleId.length === 0) {
      throw new BadRequestException('articleId is required');
    }

    const articleExists = this.db.articles.some((article) => article.id === payload.articleId);
    if (!articleExists) {
      throw new UnprocessableEntityException('articleId does not exist');
    }

    const comment: Comment = {
      id: randomUUID(),
      content: payload.content,
      articleId: payload.articleId,
      authorId: this.resolveAuthorId(payload.authorId),
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

  private resolveAuthorId(input: unknown): string | null {
    if (input === undefined || input === null) {
      return null;
    }

    if (typeof input !== 'string') {
      throw new BadRequestException('authorId is invalid');
    }

    return input;
  }
}
