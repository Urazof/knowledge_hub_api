import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ArticleStatus } from '../../common/enums/article-status.enum';

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsUUID('4')
  authorId?: string | null;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsUUID('4')
  categoryId?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

