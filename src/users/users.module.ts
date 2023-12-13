import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UsersService } from './users.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [],
  providers: [UsersService, JwtStrategy],
  controllers: [UserController],
})
export class UsersModule {}
