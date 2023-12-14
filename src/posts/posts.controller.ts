import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IResponseHandlerParams } from 'src/utils/interfaces/response.handler.interface';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Post')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
  ): Promise<IResponseHandlerParams> {
    return this.postsService.create(createPostDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req): Promise<IResponseHandlerParams> {
    return this.postsService.findAll(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-post-with-comments')
  userPostWithComment(@Req() req: Request): Promise<IResponseHandlerParams> {
    return this.postsService.userPostWithComment(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IResponseHandlerParams> {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req,
  ): Promise<IResponseHandlerParams> {
    return this.postsService.update(id, updatePostDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IResponseHandlerParams> {
    return this.postsService.remove(id);
  }
}
