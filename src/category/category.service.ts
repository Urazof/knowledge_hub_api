import { Injectable } from '@nestjs/common';
import { Category } from '../common/models/category.model';
import { InMemoryDbService } from '../storage/in-memory-db.service';

@Injectable()
export class CategoryService {
  constructor(private readonly db: InMemoryDbService) {}

  findAll(): Category[] {
    return this.db.categories;
  }
}

