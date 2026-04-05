import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { CommentModule } from './comment/comment.module';
import { StorageModule } from './storage/storage.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [StorageModule, UserModule, ArticleModule, CategoryModule, CommentModule],
})
export class AppModule {}

