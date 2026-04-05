import * as assert from 'node:assert/strict';
import { ArticleStatus } from '../src/common/enums/article-status.enum';
import { InMemoryDbService } from '../src/storage/in-memory-db.service';
import { ArticleService } from '../src/article/article.service';
import { UserService } from '../src/user/user.service';
import { CommentService } from '../src/comment/comment.service';
import { CategoryService } from '../src/category/category.service';

function getItemsCount<T>(value: T[] | { data: T[] }): number {
  return Array.isArray(value) ? value.length : value.data.length;
}

export function runExtraAutomatedTests(): void {
  const db = new InMemoryDbService();
  const userService = new UserService(db);
  const categoryService = new CategoryService(db);
  const articleService = new ArticleService(db);
  const commentService = new CommentService(db);

  const user = userService.create({ login: 'qa-user', password: '12345' });
  const category = categoryService.create({ name: 'backend', description: 'backend docs' });

  const article = articleService.create({
    title: 'Nest architecture',
    content: 'content',
    status: ArticleStatus.PUBLISHED,
    authorId: user.id,
    categoryId: category.id,
    tags: ['nestjs', 'api'],
  });

  const comment = commentService.create({
    content: 'useful',
    articleId: article.id,
    authorId: user.id,
  });

  assert.equal(comment.articleId, article.id, 'Comment should be linked to article');

  const filtered = articleService.findAll({ status: ArticleStatus.PUBLISHED, tag: 'nestjs' });
  assert.ok(Array.isArray(filtered), 'Filtered response should be array without pagination');
  assert.equal(filtered.length, 1, 'Filter by status+tag should find one article');

  const paged = articleService.findAll({ page: 1, limit: 1, sortBy: 'title', order: 'asc' });
  assert.ok(!Array.isArray(paged), 'Paged response should be wrapped in pagination object');
  assert.equal(paged.total, 1, 'Total should reflect source count');
  assert.equal(paged.data.length, 1, 'Page should contain one record');

  userService.remove(user.id);
  const articleAfterUserDelete = articleService.findOne(article.id);
  assert.equal(articleAfterUserDelete.authorId, null, 'Cascade: authorId should be null after user delete');
  assert.equal(
    getItemsCount(commentService.findByArticleId({ articleId: article.id })),
    0,
    'Cascade: user comments should be removed',
  );

  const user2 = userService.create({ login: 'qa-user-2', password: '12345' });
  const article2 = articleService.create({
    title: 'Second article',
    content: 'content',
    categoryId: category.id,
    authorId: user2.id,
  });

  categoryService.remove(category.id);
  const articleAfterCategoryDelete = articleService.findOne(article2.id);
  assert.equal(
    articleAfterCategoryDelete.categoryId,
    null,
    'Cascade: categoryId should be null after category delete',
  );

  commentService.create({ content: 'to delete', articleId: article2.id });
  articleService.remove(article2.id);
  assert.equal(
    getItemsCount(commentService.findByArticleId({ articleId: article2.id })),
    0,
    'Cascade: article comments should be removed',
  );

  // eslint-disable-next-line no-console
  console.log('extra-automated-tests: all checks passed');
}

if (require.main === module) {
  runExtraAutomatedTests();
}

