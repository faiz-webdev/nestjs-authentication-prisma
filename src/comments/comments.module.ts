import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentController, CommentsController } from './comments.controller';

@Module({
  controllers: [CommentsController, CommentController],
  providers: [CommentsService],
})
export class CommentsModule {}
