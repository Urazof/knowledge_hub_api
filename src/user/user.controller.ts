import { Controller, Get } from '@nestjs/common';
import { PublicUser } from '../common/models/user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): PublicUser[] {
    return this.userService.findAllPublic();
  }
}

