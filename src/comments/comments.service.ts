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

  async findAll(req: Request) {
    try {
      const comment = await this.prisma.comment.findMany({
        where: {
          userId: req.user['id'],
        },
      });

      return ResponseHandlerService({
        success: true,
        message: 'Comment data',
        httpCode: HttpStatus.OK,
        data: comment,
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

  async findOne(id: string, req: Request): Promise<IResponseHandlerParams> {
    try {
      const comment = await this.prisma.comment.findFirst({
        where: {
          userId: req.user['id'],
          id: id,
        },
      });

      return ResponseHandlerService({
        success: true,
        message: 'Comment data',
        httpCode: HttpStatus.OK,
        data: comment,
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

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    req: Request,
  ): Promise<IResponseHandlerParams> {
    try {
      let update;
      const checkComment = await this.prisma.comment.findFirst({
        where: {
          userId: req.user['id'],
          id,
        },
      });
      if (checkComment) {
        update = await this.prisma.comment.update({
          where: { id, userId: req.user['id'] },
          data: updateCommentDto,
        });
      } else {
        return ResponseHandlerService({
          success: false,
          message: 'No comment found (s)',
          httpCode: HttpStatus.OK,
          data: update,
        });
      }

      return ResponseHandlerService({
        success: true,
        message: 'Comment updated',
        httpCode: HttpStatus.OK,
        data: update,
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

  async remove(id: string, req: Request): Promise<IResponseHandlerParams> {
    try {
      const deletePost = await this.prisma.comment.delete({
        where: { id, userId: req.user['id'] },
      });

      return ResponseHandlerService({
        success: true,
        message: 'Post updated',
        httpCode: HttpStatus.OK,
        data: deletePost,
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

  async userCommentWithPost(req: Request): Promise<IResponseHandlerParams> {
    try {
      //belongs to the post relationship
      const comment = await this.prisma.comment.findMany({
        where: { userId: req.user['id'] },
        include: {
          post: true,
        },
      });

      return ResponseHandlerService({
        success: true,
        message: 'Post updated',
        httpCode: HttpStatus.OK,
        data: comment,
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
}
