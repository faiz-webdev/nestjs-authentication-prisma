import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { IResponseHandlerParams } from 'src/utils/interfaces/response.handler.interface';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ): Promise<IResponseHandlerParams> {
    return await this.commentsService.create(createCommentDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.commentsService.findAll(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<IResponseHandlerParams> {
    return this.commentsService.findOne(id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ): Promise<IResponseHandlerParams> {
    return this.commentsService.update(id, updateCommentDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<IResponseHandlerParams> {
    return this.commentsService.remove(id, req);
  }
}

@Controller('comment')
export class CommentController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('user-comment-with-post')
  userCommentWithPost(@Req() req: Request): Promise<IResponseHandlerParams> {
    return this.commentsService.userCommentWithPost(req);
  }
}
