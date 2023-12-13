import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMyUser(id: string, req: Request) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });
    console.log(req.user)
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
}
