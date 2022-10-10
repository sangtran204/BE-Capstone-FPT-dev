import { PartialType } from '@nestjs/swagger';
import { CreatePackageItemDTO } from './create-package-item.dto';

export class UpdatePackageItemDTO extends PartialType(CreatePackageItemDTO) {}
