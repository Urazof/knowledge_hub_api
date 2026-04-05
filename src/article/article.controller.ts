import { Controller, Get } from '@nestjs/common';
import { Article } from '../common/models/article.model';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  findAll(): Article[] {
    return this.articleService.findAll();
  }
}

