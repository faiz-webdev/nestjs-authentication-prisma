import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';
import { IResponseHandlerParams } from 'src/utils/interfaces/response.handler.interface';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('get-user-detail')
  getUserDetails(@Req() req: Request): Promise<IResponseHandlerParams> {
    return this.userService.getUserDetails(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getMyUser(@Param() params: { id: string }, @Req() req) {
    return await this.userService.getMyUser(params.id, req);
  }

  @Get('')
  getUsers() {
    return this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-user-profile/:userId')
  async updateUserProfile(
    @Param() userId: string,
    @Body() createUserProfileDto: CreateUserProfileDto,
    @Req() req: Request,
  ): Promise<IResponseHandlerParams> {
    return this.userService.updateUserProfile(
      userId,
      createUserProfileDto,
      req,
    );
  }
}
