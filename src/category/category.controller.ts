import { Controller, Get } from '@nestjs/common';
import { Category } from '../common/models/category.model';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(): Category[] {
    return this.categoryService.findAll();
  }
}

