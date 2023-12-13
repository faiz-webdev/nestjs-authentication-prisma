import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getMyUser(@Param() params: { id: string }, @Req() req) {
    return await this.userService.getMyUser(params.id, req);
  }

  @Get('')
  getUsers() {
    return this.userService.getUsers();
  }
}
