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

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req,
  ): Promise<IResponseHandlerParams> {
    return this.postsService.create(createPostDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.postsService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req,
  ) {
    return this.postsService.update(id, updatePostDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
