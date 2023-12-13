import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMyUser(id: string) {
    return await this.prisma.user.findUnique({ where: { id: id } });
  }

  async getUsers() {
    return await this.prisma.user.findMany({
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });
  }
}
