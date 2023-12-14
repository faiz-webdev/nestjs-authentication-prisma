import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Request } from 'express';
import { IResponseHandlerParams } from 'src/utils/interfaces/response.handler.interface';
import { ResponseHandlerService } from 'src/utils/response.handler.service';
import { profile } from 'console';
import { Prisma } from '@prisma/client';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMyUser(id: string, req: Request) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });

    if (!user) throw new NotFoundException();

    const decodedUser = req.user as { id: string; email: string };

    if (user.id !== decodedUser.id) throw new ForbiddenException();

    return { message: 'User data', data: { ...user } };
  }

  async getUsers() {
    return await this.prisma.user.findMany({
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });
  }

  async getUserDetails(req: Request): Promise<IResponseHandlerParams> {
    try {
      const userInfo = await this.prisma.user.findUnique({
        where: { id: req.user['id'] },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          Profile: {
            select: { bio: true },
          },
        },
        // include: {
        //   Profile: true,
        // },
      });

      //raw query
      //   const userInfo = await this.prisma.$queryRaw(
      //     Prisma.sql`SELECT * from User where email='test@mail.com'`,
      //   );

      return ResponseHandlerService({
        success: true,
        message: 'Post updated',
        httpCode: HttpStatus.OK,
        data: userInfo,
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

  async updateUserProfile(
    userId: string,
    createUserProfileDto: CreateUserProfileDto,
    req: Request,
  ) {
    try {
      let userProfile;
      userProfile = await this.prisma.profile.findFirst({
        where: { userId: req.user['id'] },
        select: { id: true, bio: true },
      });

      if (!userProfile) {
        userProfile = await this.prisma.profile.create({
          data: createUserProfileDto,
        });
      } else {
        userProfile = await this.prisma.profile.update({
          where: { userId: req.user['id'] },
          data: createUserProfileDto,
        });
      }

      return ResponseHandlerService({
        success: true,
        message: 'User profile updated successfully',
        httpCode: HttpStatus.OK,
        data: userProfile,
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
