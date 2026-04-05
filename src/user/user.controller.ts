import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PublicUser } from '../common/models/user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): PublicUser[] {
    return this.userService.findAllPublic();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): PublicUser {
    return this.userService.findOnePublic(id);
  }

  @Post()
  create(@Body() body: Record<string, unknown>): PublicUser {
    return this.userService.create(body);
  }

  @Put(':id')
  updatePassword(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: Record<string, unknown>,
  ): PublicUser {
    return this.userService.updatePassword(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): void {
    this.userService.remove(id);
  }
}
