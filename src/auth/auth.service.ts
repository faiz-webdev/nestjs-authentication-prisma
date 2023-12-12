import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/constants';

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

    return { message: 'User registered', data: user };

    // return 'signup' + dto;
  }

  async signin(dto: CreateAuthDto) {
    const { email, password } = dto;

    const userExist = await this.prisam.user.findUnique({ where: { email } });

    // if (userExist) {
    //   const isMatch = await this.comparePassword(password, userExist.password);
    //   if (!isMatch) throw new BadRequestException('Invalid credentials');
    // } else {
    //   throw new BadRequestException('Invalid credentials');
    // }

    if (!userExist) {
      throw new BadRequestException('Invalid credentials');
    }

    const isMatch = await this.comparePassword(password, userExist.password);

    if (!isMatch) throw new BadRequestException('Invalid credentials');

    const token = await this.signToken({
      id: userExist.id,
      email: userExist.email,
    });

    return { message: 'Login successfull', data: { token } };
  }

  async signout() {
    return 'signout';
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
