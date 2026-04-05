import { Controller, Get } from '@nestjs/common';
import { Comment } from '../common/models/comment.model';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  findAll(): Comment[] {
    return this.commentService.findAll();
  }
}

