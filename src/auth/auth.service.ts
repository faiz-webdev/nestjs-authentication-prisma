import { Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  async signup() {
    return 'signup';
  }

  async signin() {
    return 'signin';
  }

  async signout() {
    return 'signout';
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
