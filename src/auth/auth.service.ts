import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisam: PrismaService) {}

  async signup(dto: CreateAuthDto) {
    const { email, password } = dto;

    const userExist = await this.prisam.user.findUnique({ where: { email } });

    if (userExist) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await this.hashPassword(password);
    const user = await this.prisam.user.create({
      data: { email, password: hashedPassword },
    });

    return { message: 'User registered', data: user };

    // return 'signup' + dto;
  }

  async signin(dto: CreateAuthDto) {
    const { email, password } = dto;

    const userExist = await this.prisam.user.findUnique({ where: { email } });

    if (userExist) {
      const isMatch = await this.comparePassword(password, userExist.password);
      if (!isMatch) throw new BadRequestException('Invalid credentials');
    } else {
      throw new BadRequestException('Invalid credentials');
    }
  }

  async signout() {
    return 'signout';
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePassword(password: string, hashed: string) {
    return await bcrypt.compare(password, hashed);
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
