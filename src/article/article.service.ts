import { Injectable } from '@nestjs/common';
import { Article } from '../common/models/article.model';
import { InMemoryDbService } from '../storage/in-memory-db.service';

@Injectable()
export class ArticleService {
  constructor(private readonly db: InMemoryDbService) {}

  findAll(): Article[] {
    return this.db.articles;
  }
}

