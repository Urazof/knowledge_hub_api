import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Comment } from '../common/models/comment.model';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  findAllByArticle(
    @Query('articleId', new ParseUUIDPipe({ version: '4' })) articleId: string,
  ): Comment[] {
    return this.commentService.findByArticleId(articleId);
  }

  @Post()
  create(@Body() body: Record<string, unknown>): Comment {
    return this.commentService.create(body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): void {
    this.commentService.remove(id);
  }
}
