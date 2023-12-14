import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { ThrottlerModule } from '@nestjs/throttler';
@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    AuthModule,
    PrismaModule,
    UsersModule,
    PostsModule,
    CommentsModule,
  ],
})
export class AppModule {}
