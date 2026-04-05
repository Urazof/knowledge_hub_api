import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Category } from '../common/models/category.model';
import { InMemoryDbService } from '../storage/in-memory-db.service';

interface CreateCategoryPayload {
  name?: unknown;
  description?: unknown;
}

interface UpdateCategoryPayload {
  name?: unknown;
  description?: unknown;
}

@Injectable()
export class CategoryService {
  constructor(private readonly db: InMemoryDbService) {}

  findAll(): Category[] {
    return this.db.categories;
  }

  findOne(id: string): Category {
    return this.findOneOrThrow(id);
  }

  create(payload: CreateCategoryPayload): Category {
    if (typeof payload.name !== 'string' || payload.name.length === 0) {
      throw new BadRequestException('name is required');
    }

    if (typeof payload.description !== 'string' || payload.description.length === 0) {
      throw new BadRequestException('description is required');
    }

    const category: Category = {
      id: randomUUID(),
      name: payload.name,
      description: payload.description,
    };

    this.db.categories.push(category);
    return category;
  }

  update(id: string, payload: UpdateCategoryPayload): Category {
    const category = this.findOneOrThrow(id);

    if (payload.name !== undefined) {
      if (typeof payload.name !== 'string' || payload.name.length === 0) {
        throw new BadRequestException('name is invalid');
      }
      category.name = payload.name;
    }

    if (payload.description !== undefined) {
      if (typeof payload.description !== 'string' || payload.description.length === 0) {
        throw new BadRequestException('description is invalid');
      }
      category.description = payload.description;
    }

    return category;
  }

  remove(id: string): void {
    const category = this.findOneOrThrow(id);
    const index = this.db.categories.findIndex((item) => item.id === category.id);
    this.db.categories.splice(index, 1);

    this.db.articles.forEach((article) => {
      if (article.categoryId === category.id) {
        article.categoryId = null;
      }
    });
  }

  private findOneOrThrow(id: string): Category {
    const category = this.db.categories.find((item) => item.id === id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
