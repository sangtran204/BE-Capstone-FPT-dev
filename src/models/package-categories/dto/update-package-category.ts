import { PartialType } from '@nestjs/swagger';
import { CreatePackageCategoryDTO } from './create-package-category';
export class UpdatePackageCategoryDTO extends PartialType(
  CreatePackageCategoryDTO,
) {}
