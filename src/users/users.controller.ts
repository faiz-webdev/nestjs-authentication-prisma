import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  getMyUser(@Param() params: { id: string }) {
    return this.userService.getMyUser(params.id);
  }

  @Get('')
  getUsers() {
    return this.userService.getUsers();
  }
}
