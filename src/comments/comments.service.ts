import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { IResponseHandlerParams } from 'src/utils/interfaces/response.handler.interface';
import { PrismaService } from 'prisma/prisma.service';
import { ResponseHandlerService } from 'src/utils/response.handler.service';
import { Request } from 'express';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCommentDto: CreateCommentDto,
    req: Request,
  ): Promise<IResponseHandlerParams> {
    try {
      const comment = await this.prisma.comment.create({
        data: {
          title: createCommentDto.title,
          content: createCommentDto.content,
          postId: createCommentDto.postId,
          userId: req.user['id'],
        },
      });
      return ResponseHandlerService({
        success: true,
        message: 'Comment created successfully',
        httpCode: HttpStatus.OK,
        data: {},
      });
    } catch (error) {
      return ResponseHandlerService({
        success: false,
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Unable to process your data. Please try again later`,
        errorDetails: error.toString(),
      });
    }
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
