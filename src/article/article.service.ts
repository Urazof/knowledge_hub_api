import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ArticleStatus } from '../common/enums/article-status.enum';
import { Article } from '../common/models/article.model';
import { InMemoryDbService } from '../storage/in-memory-db.service';

interface CreateArticlePayload {
  title?: unknown;
  content?: unknown;
  status?: unknown;
  authorId?: unknown;
  categoryId?: unknown;
  tags?: unknown;
}

interface UpdateArticlePayload {
  title?: unknown;
  content?: unknown;
  status?: unknown;
  authorId?: unknown;
  categoryId?: unknown;
  tags?: unknown;
}

@Injectable()
export class ArticleService {
  constructor(private readonly db: InMemoryDbService) {}

  findAll(): Article[] {
    return this.db.articles;
  }

  findOne(id: string): Article {
    return this.findOneOrThrow(id);
  }

  create(payload: CreateArticlePayload): Article {
    if (typeof payload.title !== 'string' || payload.title.length === 0) {
      throw new BadRequestException('title is required');
    }

    if (typeof payload.content !== 'string' || payload.content.length === 0) {
      throw new BadRequestException('content is required');
    }

    const now = Date.now();
    const article: Article = {
      id: randomUUID(),
      title: payload.title,
      content: payload.content,
      status: this.resolveStatus(payload.status),
      authorId: this.resolveNullableString(payload.authorId),
      categoryId: this.resolveNullableString(payload.categoryId),
      tags: this.resolveTags(payload.tags),
      createdAt: now,
      updatedAt: now,
    };

    this.db.articles.push(article);
    return article;
  }

  update(id: string, payload: UpdateArticlePayload): Article {
    const article = this.findOneOrThrow(id);

    if (payload.title !== undefined) {
      if (typeof payload.title !== 'string' || payload.title.length === 0) {
        throw new BadRequestException('title is invalid');
      }
      article.title = payload.title;
    }

    if (payload.content !== undefined) {
      if (typeof payload.content !== 'string' || payload.content.length === 0) {
        throw new BadRequestException('content is invalid');
      }
      article.content = payload.content;
    }

    if (payload.status !== undefined) {
      article.status = this.resolveStatus(payload.status);
    }

    if (payload.authorId !== undefined) {
      article.authorId = this.resolveNullableString(payload.authorId);
    }

    if (payload.categoryId !== undefined) {
      article.categoryId = this.resolveNullableString(payload.categoryId);
    }

    if (payload.tags !== undefined) {
      article.tags = this.resolveTags(payload.tags);
    }

    article.updatedAt = Date.now();
    return article;
  }

  remove(id: string): void {
    const article = this.findOneOrThrow(id);
    const index = this.db.articles.findIndex((item) => item.id === article.id);
    this.db.articles.splice(index, 1);

    const commentsToKeep = this.db.comments.filter((comment) => comment.articleId !== article.id);
    this.db.comments.splice(0, this.db.comments.length, ...commentsToKeep);
  }

  private resolveStatus(input: unknown): ArticleStatus {
    if (input === undefined) {
      return ArticleStatus.DRAFT;
    }

    if (
      input === ArticleStatus.DRAFT ||
      input === ArticleStatus.PUBLISHED ||
      input === ArticleStatus.ARCHIVED
    ) {
      return input;
    }

    throw new BadRequestException('status is invalid');
  }

  private resolveNullableString(input: unknown): string | null {
    if (input === undefined || input === null) {
      return null;
    }

    if (typeof input === 'string') {
      return input;
    }

    throw new BadRequestException('value is invalid');
  }

  private resolveTags(input: unknown): string[] {
    if (input === undefined) {
      return [];
    }

    if (!Array.isArray(input) || input.some((tag) => typeof tag !== 'string')) {
      throw new BadRequestException('tags are invalid');
    }

    return input;
  }

  private findOneOrThrow(id: string): Article {
    const article = this.db.articles.find((item) => item.id === id);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }
}
