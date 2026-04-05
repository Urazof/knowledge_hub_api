import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Category } from '../common/models/category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryService } from './category.service';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories.' })
  @ApiOkResponse({ description: 'Categories returned.' })
  findAll(): Category[] {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id.' })
  @ApiOkResponse({ description: 'Category returned.' })
  @ApiBadRequestResponse({ description: 'Invalid UUID.' })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Category {
    return this.categoryService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create category.' })
  @ApiCreatedResponse({ description: 'Category created.' })
  @ApiBadRequestResponse({ description: 'Invalid body.' })
  create(@Body() body: CreateCategoryDto): Category {
    return this.categoryService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category.' })
  @ApiOkResponse({ description: 'Category updated.' })
  @ApiBadRequestResponse({ description: 'Invalid UUID or body.' })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: UpdateCategoryDto,
  ): Category {
    return this.categoryService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete category.' })
  @ApiNoContentResponse({ description: 'Category deleted.' })
  @ApiBadRequestResponse({ description: 'Invalid UUID.' })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): void {
    this.categoryService.remove(id);
  }
}
