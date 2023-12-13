import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/constants';
import { Request, Response } from 'express';
import { IUser } from 'src/utils/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisam: PrismaService,
    private readonly jwt: JwtService,
  ) {}

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

    delete user.password;
    return { message: 'User registered', data: user };

    // return 'signup' + dto;
  }

  async signin(dto: CreateAuthDto, req: Request, res: Response) {
    const { email, password } = dto;

    const userExist = await this.prisam.user.findUnique({ where: { email } });

    if (!userExist) {
      throw new BadRequestException('Invalid credentials');
    }

    const isMatch = await this.comparePassword(password, userExist.password);

    if (!isMatch) throw new BadRequestException('Invalid credentials');

    const token = await this.signToken({
      id: userExist.id,
      email: userExist.email,
    });

    if (!token) throw new ForbiddenException();

    res.cookie('nestjs-prisma', token);
    // return res.send({ message: 'Logged in successfull' });
    // return { message: 'Login successfull', data: { token } };
    return res.send({
      message: 'Logged in successfull',
      data: { accessToken: token },
    });
  }

  async signout(req: Request, res: Response) {
    res.clearCookie('nestjs-prisma');
    return res.send({
      message: 'Log out successfull',
      data: {},
    });
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePassword(password: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(password, hashed);
  }

  async signToken(args: { id: string; email: string }) {
    const payload = args;
    const token = await this.jwt.signAsync(payload, {
      secret: jwtSecret,
    });
    return token;
  }

  async getUserByEmail(email: string): Promise<IUser> {
    const user: any = await this.prisam.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: false,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
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
