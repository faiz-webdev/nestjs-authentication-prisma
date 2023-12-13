import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'prisma/prisma.service';
import { IResponseHandlerParams } from 'src/utils/interfaces/response.handler.interface';
import { ResponseHandlerService } from 'src/utils/response.handler.service';
import { Request } from 'express';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createPostDto: CreatePostDto,
    req: Request,
  ): Promise<IResponseHandlerParams> {
    const checkPost = await this.prisma.post.findFirst({
      where: {
        userId: req.user['id'],
        title: { contains: createPostDto.title, mode: 'insensitive' },
      },
    });

    if (checkPost) {
      return ResponseHandlerService({
        success: true,
        message: 'Post is already created',
        httpCode: HttpStatus.OK,
      });
    }

    const post = await this.prisma.post.create({
      data: createPostDto,
    });
    return ResponseHandlerService({
      success: true,
      message: 'Post created successfully',
      httpCode: HttpStatus.OK,
      data: post,
    });
  }

  async findAll(req: Request): Promise<IResponseHandlerParams> {
    try {
      const posts = await this.prisma.post.findMany({
        where: {
          userId: req.user['id'],
        },
      });

      return ResponseHandlerService({
        success: true,
        message: 'Posts data',
        httpCode: HttpStatus.OK,
        data: posts,
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

  async findOne(id: string): Promise<IResponseHandlerParams> {
    try {
      const post = await this.prisma.post.findUnique({
        where: {
          id,
        },
      });

      return ResponseHandlerService({
        success: true,
        message: 'Post data',
        httpCode: HttpStatus.OK,
        data: post,
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
    updatePostDto: UpdatePostDto,
    req: Request,
  ): Promise<IResponseHandlerParams> {
    try {
      let update;
      if (updatePostDto.title) {
        const checkPost = await this.prisma.post.findFirst({
          where: {
            userId: req.user['id'],
            title: { contains: updatePostDto.title, mode: 'insensitive' },
          },
        });
        if (checkPost) {
          if (checkPost.id === id) {
            update = await this.prisma.post.update({
              where: { id, userId: req.user['id'] },
              data: updatePostDto,
            });
          } else {
            return ResponseHandlerService({
              success: false,
              message: 'Duplicate post occured',
              httpCode: HttpStatus.OK,
            });
          }
        } else {
          update = await this.prisma.post.update({
            where: { id, userId: req.user['id'] },
            data: updatePostDto,
          });
        }
      } else {
        update = await this.prisma.post.update({
          where: { id, userId: req.user['id'] },
          data: updatePostDto,
        });
      }

      return ResponseHandlerService({
        success: true,
        message: 'Post updated',
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

  async remove(id: string): Promise<IResponseHandlerParams> {
    try {
      const deletePost = await this.prisma.post.delete({ where: { id } });

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
}
