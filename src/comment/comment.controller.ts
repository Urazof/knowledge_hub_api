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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Comment } from '../common/models/comment.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentService } from './comment.service';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @ApiOperation({ summary: 'Get comments by articleId.' })
  @ApiOkResponse({ description: 'Comments returned.' })
  @ApiBadRequestResponse({ description: 'Invalid or missing articleId.' })
  findAllByArticle(
    @Query('articleId', new ParseUUIDPipe({ version: '4' })) articleId: string,
  ): Comment[] {
    return this.commentService.findByArticleId(articleId);
  }

  @Post()
  @ApiOperation({ summary: 'Create comment.' })
  @ApiCreatedResponse({ description: 'Comment created.' })
  @ApiBadRequestResponse({ description: 'Invalid body.' })
  @ApiUnprocessableEntityResponse({ description: 'articleId does not exist.' })
  create(@Body() body: CreateCommentDto): Comment {
    return this.commentService.create(body);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete comment.' })
  @ApiNoContentResponse({ description: 'Comment deleted.' })
  @ApiBadRequestResponse({ description: 'Invalid UUID.' })
  @ApiNotFoundResponse({ description: 'Comment not found.' })
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): void {
    this.commentService.remove(id);
  }
}
